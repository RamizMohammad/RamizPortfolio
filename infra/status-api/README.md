# infra-status

The live feed behind [mohammadramiz.in/infra](https://www.mohammadramiz.in/infra). It is a small
Python service, standard library only, that runs on the VPS next to the Beszel hub. It reads Beszel's
API over the internal Docker network and serves one cached JSON document containing:

- **Host:** name, online status, uptime, CPU, memory, disk and load.
- **Services:** for each service you list in `services.json`, whether its container is running
  and its CPU and memory use from Beszel's latest one-minute sample.

Nothing else is published: no IPs, ports, images, environment, or containers you didn't list.
Only the origins in `ALLOW_ORIGINS` can read it from a browser. Responses are cached for 20 s, so
visitors never reach Beszel directly.

## Set up on the VPS

1. **Copy this folder to the server**, for example to `/opt/infra-status`.

2. **Make a Beszel user for it.** In the Beszel hub, add a user with read access to the VPS system.
   A read-only user is enough, if your Beszel version offers one. Put its login in `.env`:

   ```bash
   cp .env.example .env    # fill in BESZEL_EMAIL, BESZEL_PASSWORD and BESZEL_SYSTEM
   ```

   `BESZEL_URL` defaults to `http://beszel:8090`: the hub's container name on `proxy_network`, and
   the port it serves on inside the container. This is not the 9000 you published on the host.

3. **List what the page should show** in `services.json`, starting from `services.example.json`.
   Use one entry per service:

   | Field | What |
   | --- | --- |
   | `id` | Unique, stable key |
   | `label` | Name shown on the page |
   | `container` | The container name, exactly as Beszel shows it under Containers |
   | `domain` | Optional: the public hostname nginx serves it on |
   | `kind` | `web`, `api`, `db`, `worker`, `bot` or `monitoring`; picks the chip colour |
   | `description` | One line, shown when there is no domain |

   Leave out anything you don't want public, such as admin panels or databases. Unlisted containers
   are never shown.

4. **Start it.** It joins the existing `proxy_network` and publishes no ports:

   ```bash
   docker compose up -d --build
   docker logs infra-status          # should say: infra-status on :8080
   ```

5. **Expose it through nginx.** Add a server block, or a location in an existing one. Your current
   sites are not touched:

   ```nginx
   server {
       listen 443 ssl;
       server_name infra-api.mohammadramiz.in;
       # ssl_certificate … as for your other sites

       location = /status {
           limit_except GET OPTIONS { deny all; }
           proxy_pass http://infra-status:8080/status;
       }
       location / { return 404; }
   }
   ```

   Then run `nginx -t` and reload nginx.

6. **Point the site at it.** In Vercel, or `.env.local` for development, set:

   ```bash
   NEXT_PUBLIC_INFRA_URL=https://infra-api.mohammadramiz.in/status
   ```

   Until this is set, `/infra` shows a "not connected yet" card instead of live data.

## Check it

```bash
curl -s https://infra-api.mohammadramiz.in/status | head -c 400
curl -s -I -H "Origin: https://www.mohammadramiz.in" https://infra-api.mohammadramiz.in/status | grep -i access-control
```

## Notes

- **Beszel versions.** The service reads Beszel's `systems` collection (fields `status` and `info`)
  and `container_stats` (the newest `1m` record's `stats` list). If a Beszel update renames those
  fields, the page shows "—" for that value instead of breaking. Check the
  `curl` output after upgrading Beszel.
- **If Beszel is down,** the service keeps serving the last good reading. Before it has ever
  succeeded, it returns `503`.
