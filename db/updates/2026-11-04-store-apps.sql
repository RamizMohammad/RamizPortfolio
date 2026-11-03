-- 2026-11-04: add the store_apps table (the /winstore page) and fill it.
-- Run once against the live database with a key that can create tables, then rebuild the site.

set search_path = portfolio;

begin;

-- ---------------------------------------------------------------- the /winstore page
create table if not exists store_apps (
  id          serial primary key,
  sort        int not null default 0,
  slug        text not null unique,
  name        text not null,
  kind        text not null check (kind in ('app', 'vscode', 'extension')),
  category    text not null,                  -- e.g. 'Backup', 'Browser extension'
  publisher   text,                           -- when not me, e.g. 'Loopax Technologies'
  tagline     text not null,
  about       text not null,
  version     text,
  released    text,                           -- as shown, e.g. '21 Sep 2026'
  size_label  text,                           -- e.g. '39.2 MB'
  requires    text not null,                  -- system requirements line
  tone        text not null default 'violet' check (tone in ('pink', 'lime', 'blue', 'sun', 'violet', 'mint')),
  logo        jsonb,                          -- {src, width, height, alt}; a monogram shows without one
  download    jsonb not null,                 -- {label, file, href}: the main Get button
  install     text,                           -- optional one-line install command
  steps       text[],                         -- optional manual install steps
  downloads   jsonb,                          -- [{label, file, href}] other packages
  links       jsonb,                          -- [{label, href}] website, releases, source
  features    text[],
  system_slug text,                           -- links to /work/<slug> when set
  updated_at  timestamptz not null default now()
);

drop trigger if exists touch_updated_at on portfolio.store_apps;
create trigger touch_updated_at before update on portfolio.store_apps for each row execute function portfolio.touch_updated_at();

insert into portfolio.store_apps (sort, slug, name, kind, category, publisher, tagline, about, version, released, size_label, requires, tone, logo, download, install, steps, downloads, links, features, system_slug) values
  (0, 'snapy', 'Snapy', 'app', 'Utilities', 'Loopax Technologies', 'Back up a whole Android phone to your PC, and put it back after a wipe.', 'Snapy captures an Android phone''s full state to your PC and restores it after a wipe or an OS reinstall. It works entirely over ADB, so it needs no root and no cloud account, and comes as a desktop app with a scriptable CLI.', '1.0.0', '21 Sep 2026', '39.2 MB', 'Windows 10 or 11 · an Android phone with USB debugging on', 'sun', null, '{"label":"Get the installer","file":"Snapy-1.0.0-setup.exe","href":"https://github.com/RamizMohammad/snapy/releases/download/v1.0.0/Snapy-1.0.0-setup.exe"}'::jsonb, null, null, null, '[{"label":"All releases","href":"https://github.com/RamizMohammad/snapy/releases"}]'::jsonb, array['Full phone snapshot and restore over ADB', 'Works on stock, unrooted phones', 'PySide6 desktop app plus a Python CLI']::text[], 'snapy'),
  (1, 'bakup', 'bakup', 'app', 'Backup', null, 'Backup like you git: commit offline, push to your own server.', 'Turn any folder into a repository, commit snapshots offline and push them to your own server when you are online. Any earlier version restores on any machine with one clone, and identical files are stored once across every repository.', '0.1.0', '7 Jul 2026', '15.5 MB', 'Windows 10 or 11 · your own bakup server (Docker) for sync', 'lime', null, '{"label":"Get the installer","file":"bakup-setup-0.1.0.exe","href":"https://github.com/RamizMohammad/Bakup-Release/releases/download/backup-v1.0/bakup-setup-0.1.0.exe"}'::jsonb, null, null, '[{"label":"Python wheel","file":"bakup-0.1.0-py3-none-any.whl","href":"https://github.com/RamizMohammad/Bakup-Release/releases/download/backup-v1.0/bakup-0.1.0-py3-none-any.whl"},{"label":"Debian / Ubuntu","file":"bakup_0.1.0_all.deb","href":"https://github.com/RamizMohammad/Bakup-Release/releases/download/backup-v1.0/bakup_0.1.0_all.deb"},{"label":"Server (Docker Compose)","file":"docker-compose.yml","href":"https://github.com/RamizMohammad/Bakup-Release/releases/download/backup-v1.0/docker-compose.yml"}]'::jsonb, '[{"label":"bakup.mohammadramiz.in","href":"https://bakup.mohammadramiz.in/"},{"label":"Read the paper","href":"https://www.researchgate.net/publication/409147519_bakup_A_Git-Inspired_Offline-First_Personal_Backup_System_with_Content-Addressed_Cross-Repository_Deduplication"},{"label":"All releases","href":"https://github.com/RamizMohammad/Bakup-Release/releases"}]'::jsonb, array['init, commit, push, clone and restore from the command line', 'SHA-256 content addressing deduplicates across repositories', 'Self-hosted FastAPI server with a web dashboard']::text[], 'bakup'),
  (2, 'linkium', 'Linkium', 'app', 'Connectivity', null, 'Pair two devices and pass files and messages between them.', 'Linkium pairs two devices and keeps a live WebSocket link between them, so you can move files and send messages without a cable or a cloud drive.', '2.0', '26 May 2026', '18.4 MB', 'Windows 10 or 11 · both devices on the same network', 'blue', '{"src":"/images/logos/linkium.webp","width":96,"height":96,"alt":"Linkium logo"}'::jsonb, '{"label":"Get the installer","file":"Linkium_Setup_v2.0.exe","href":"https://github.com/RamizMohammad/SteamDeck/releases/download/Linkium-v2.0/Linkium_Setup_v2.0.exe"}'::jsonb, null, null, '[{"label":"v1.0 MSIX package","file":"Linkium.msix","href":"https://github.com/RamizMohammad/SteamDeck/releases/download/v1.0/Linkium.msix"}]'::jsonb, '[{"label":"Website","href":"https://www.desksync.space/"},{"label":"All releases","href":"https://github.com/RamizMohammad/SteamDeck/releases"}]'::jsonb, array['Device pairing with a live two-way connection', 'File transfer and messages over WebSocket', 'Lightweight Tkinter desktop app']::text[], 'linkium'),
  (3, 'backup-engine', 'Backup Engine', 'app', 'Backup', null, 'Compressed snapshots of the folders that matter, on a schedule you set.', 'Backup Engine takes compressed snapshots of the folders you choose and hashes every file, so each run only picks up what changed. The work runs on background threads, so the window never freezes.', '1.0', '25 Jan 2026', '29.1 MB', 'Windows 10 or 11', 'violet', '{"src":"/images/logos/backup-engine.webp","width":96,"height":96,"alt":"Backup Engine logo"}'::jsonb, '{"label":"Get the installer","file":"Backup.Engine.Installer.exe","href":"https://github.com/RamizMohammad/Backup_Engine/releases/download/v1.0/Backup.Engine.Installer.exe"}'::jsonb, null, null, null, '[{"label":"All releases","href":"https://github.com/RamizMohammad/Backup_Engine/releases"}]'::jsonb, array['Change detection by file hashing', 'Compressed snapshot archives', 'PyQt interface with background worker threads']::text[], 'backup-engine'),
  (4, 'chatdump', 'ChatDump', 'extension', 'Browser extension', null, 'A floating side panel for any AI chat.', 'ChatDump opens a side panel beside Claude, ChatGPT or Gemini that renders the conversation as clean markdown, summarises it with Gemini, maps how the conversation flowed and keeps a history of your sessions.', '2.0.0', null, null, 'Chrome, Edge or Brave (Manifest V3)', 'pink', null, '{"label":"Download the source","file":"ChatDump.zip","href":"https://github.com/RamizMohammad/ChatDump---Extension/archive/refs/heads/main.zip"}'::jsonb, null, array['Download and unzip the source.', 'Open chrome://extensions and turn on Developer mode.', 'Choose Load unpacked and pick the unzipped folder.']::text[], null, '[{"label":"Source on GitHub","href":"https://github.com/RamizMohammad/ChatDump---Extension"}]'::jsonb, array['Markdown rendering of any AI chat', 'Gemini-powered conversation summary', 'Conversation flow map and session history']::text[], null),
  (5, 'leakyspanner', 'LeakySpanner', 'extension', 'FastAPI extension', null, 'Find memory leaks in a FastAPI app without touching it.', 'LeakySpanner attaches to a FastAPI app in one line and watches as a pure spectator: it samples memory on a background thread, tracks the memory each endpoint adds and uses tracemalloc to find the top allocation sites, without blocking a request or adding latency.', '0.1.2', null, null, 'Python 3.8+ · FastAPI', 'mint', null, '{"label":"Download the source","file":"LeakySpanner.zip","href":"https://github.com/RamizMohammad/LeakySpanner---Exttension-/archive/refs/heads/master.zip"}'::jsonb, 'pip install git+https://github.com/RamizMohammad/LeakySpanner---Exttension-.git', null, null, '[{"label":"Source on GitHub","href":"https://github.com/RamizMohammad/LeakySpanner---Exttension-"}]'::jsonb, array['One-line setup: leakyspanner(app)', 'Per-endpoint memory deltas and allocation traces', 'Never blocks a request; if it crashes, your app keeps running']::text[], null);

commit;
