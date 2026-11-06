"""
infra-status: the public face of the VPS for mohammadramiz.in/infra.

Reads the Beszel hub (PocketBase API) over the internal Docker network and serves one small,
cached JSON document: the host's health and, for each service listed in services.json, whether its
container is running and how much CPU and memory it uses. Nothing else leaves the server: no IPs,
ports, environment, images or containers that are not listed.

Standard library only, so the image stays tiny and there is nothing to keep patched but Python.
"""

from __future__ import annotations

import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BESZEL_URL = os.environ.get("BESZEL_URL", "http://beszel:8090").rstrip("/")
BESZEL_EMAIL = os.environ.get("BESZEL_EMAIL", "")
BESZEL_PASSWORD = os.environ.get("BESZEL_PASSWORD", "")
# Which Beszel system is the VPS; the first one when unset.
BESZEL_SYSTEM = os.environ.get("BESZEL_SYSTEM", "")
SERVICES_FILE = os.environ.get("SERVICES_FILE", "/config/services.json")
CACHE_SECONDS = float(os.environ.get("CACHE_SECONDS", "20"))
ALLOW_ORIGINS = {o.strip() for o in os.environ.get("ALLOW_ORIGINS", "https://www.mohammadramiz.in,https://mohammadramiz.in").split(",") if o.strip()}
PORT = int(os.environ.get("PORT", "8080"))

_lock = threading.Lock()
_cache: dict = {"at": 0.0, "body": None}
_token: dict = {"value": "", "at": 0.0}


def _request(path: str, *, data: dict | None = None, auth: bool = True) -> dict:
    req = urllib.request.Request(
        f"{BESZEL_URL}{path}",
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Content-Type": "application/json", **({"Authorization": _token["value"]} if auth and _token["value"] else {})},
        method="POST" if data is not None else "GET",
    )
    with urllib.request.urlopen(req, timeout=8) as res:
        return json.load(res)


def _login() -> None:
    # PocketBase tokens last days; refresh well before that.
    if _token["value"] and time.time() - _token["at"] < 6 * 3600:
        return
    if not (BESZEL_EMAIL and BESZEL_PASSWORD):
        raise RuntimeError("BESZEL_EMAIL and BESZEL_PASSWORD are not set")
    body = _request("/api/collections/users/auth-with-password", data={"identity": BESZEL_EMAIL, "password": BESZEL_PASSWORD}, auth=False)
    _token.update(value=body["token"], at=time.time())


def _records(collection: str, **params: str) -> list[dict]:
    query = urllib.parse.urlencode({"perPage": "50", **params})
    return _request(f"/api/collections/{collection}/records?{query}").get("items", [])


def _num(v, digits: int = 1):
    try:
        return round(float(v), digits)
    except (TypeError, ValueError):
        return None


def _snapshot() -> dict:
    with open(SERVICES_FILE, encoding="utf-8") as f:
        config = json.load(f)

    _login()
    systems = _records("systems")
    system = next((s for s in systems if BESZEL_SYSTEM in (s.get("name"), s.get("id"))), None) if BESZEL_SYSTEM else (systems[0] if systems else None)
    if system is None:
        raise RuntimeError("Beszel has no matching system")

    info = system.get("info") or {}
    # The newest one-minute container sample for this system.
    latest = _records("container_stats", filter=f"system='{system['id']}' && type='1m'", sort="-created", perPage="1")
    stats = {c.get("n"): c for c in (latest[0].get("stats") or [])} if latest else {}
    sampled = latest[0].get("created") if latest else None
    host_up = system.get("status") == "up"

    services = []
    for s in config.get("services", []):
        c = stats.get(s.get("container"))
        status = "up" if c else ("down" if stats and host_up else "unknown")
        services.append(
            {
                "id": s["id"],
                "label": s.get("label", s["id"]),
                "description": s.get("description", ""),
                "kind": s.get("kind", "service"),
                "domain": s.get("domain"),
                "status": status,
                "cpu": _num(c.get("c")) if c else None,
                "memoryMb": _num(c.get("m"), 0) if c else None,
            }
        )

    load = info.get("la") or [info.get("l1"), info.get("l5"), info.get("l15")]
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sampledAt": sampled,
        "host": {
            "name": config.get("host", system.get("name", "server")),
            "status": system.get("status", "unknown"),
            "uptimeSeconds": _num(info.get("u"), 0),
            "cpu": _num(info.get("cpu")),
            "memory": _num(info.get("mp")),
            "disk": _num(info.get("dp")),
            "cores": info.get("c"),
            "load": [x for x in (_num(v, 2) for v in load) if x is not None] or None,
        },
        "proxy": config.get("proxy", {"label": "nginx", "description": "Reverse proxy and TLS"}),
        "services": services,
    }


def snapshot() -> tuple[int, bytes]:
    with _lock:
        if _cache["body"] is not None and time.time() - _cache["at"] < CACHE_SECONDS:
            return 200, _cache["body"]
        try:
            body = json.dumps(_snapshot(), separators=(",", ":")).encode()
            _cache.update(at=time.time(), body=body)
            return 200, body
        except Exception as e:  # noqa: BLE001 — any failure becomes a 503 with the last good copy
            _token["value"] = "" if isinstance(e, urllib.error.HTTPError) and e.code in (401, 403) else _token["value"]
            print(f"infra-status: {type(e).__name__}: {e}", flush=True)
            if _cache["body"] is not None:
                return 200, _cache["body"]
            return 503, json.dumps({"error": "status unavailable"}).encode()


class Handler(BaseHTTPRequestHandler):
    server_version = "infra-status"
    sys_version = ""

    def _cors(self) -> None:
        origin = self.headers.get("Origin", "")
        if origin in ALLOW_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "GET")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/healthz":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"ok")
            return
        if self.path.split("?")[0] not in ("/", "/status"):
            self.send_response(404)
            self.end_headers()
            return
        code, body = snapshot()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", f"public, max-age={int(CACHE_SECONDS)}")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args) -> None:  # the proxy already logs requests
        pass


if __name__ == "__main__":
    print(f"infra-status on :{PORT}, reading {BESZEL_URL}", flush=True)
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
