-- 2026-11-06: split "Other extensions" on /winstore into Python libraries (pip) and Chrome extensions.
-- LeakySpanner is on PyPI now and FastReact joins it; ChatDump becomes a Chrome extension.
-- Run after 2026-11-06-store-platforms.sql.

begin;

alter table portfolio.store_apps drop constraint if exists store_apps_kind_check;
update portfolio.store_apps set kind = 'chrome' where kind = 'extension' and slug = 'chatdump';
update portfolio.store_apps set kind = 'pip' where kind = 'extension';
alter table portfolio.store_apps add constraint store_apps_kind_check check (kind in ('app', 'vscode', 'pip', 'chrome'));

update portfolio.store_apps set
  sort = 6, kind = 'pip', category = 'Python library · FastAPI', released = '20 Apr 2026', requires = 'Python 3.8+ · FastAPI',
  download = '{"label":"View on PyPI","file":"leakyspanner","href":"https://pypi.org/project/leakyspanner/"}'::jsonb, install = 'pip install leakyspanner', downloads = null, links = '[{"label":"PyPI","href":"https://pypi.org/project/leakyspanner/"},{"label":"Source on GitHub","href":"https://github.com/RamizMohammad/LeakySpanner---Exttension-"}]'::jsonb
 where slug = 'leakyspanner';
update portfolio.store_apps set
  sort = 8, kind = 'chrome', category = 'Chrome extension', released = null, requires = 'Chrome, Edge or Brave (Manifest V3)',
  download = '{"label":"Download the source","file":"ChatDump.zip","href":"https://github.com/RamizMohammad/ChatDump---Extension/archive/refs/heads/main.zip"}'::jsonb, install = null, downloads = null, links = '[{"label":"Source on GitHub","href":"https://github.com/RamizMohammad/ChatDump---Extension"}]'::jsonb
 where slug = 'chatdump';

insert into portfolio.store_apps (sort, slug, name, kind, category, publisher, tagline, about, version, released, size_label, requires, tone, logo, download, platforms, os_downloads, install, steps, downloads, links, features, system_slug) values
  (7, 'fastreact', 'FastReact', 'pip', 'Python library · FastAPI + React', null, 'FastAPI and React as one stack: one server, zero config.', 'FastReact bridges FastAPI (or Flask) and a React app into a single stack served by one uvicorn instance, in development and in production. React pages live behind routes you register in Python, so Python decides what the browser can reach, and Python errors show up in the browser as a traceback overlay instead of a JSON blob.', '0.1.1', '9 Mar 2026', null, 'Python 3.9+ · FastAPI or Flask', 'sun', null, '{"label":"View on PyPI","file":"fastreact","href":"https://pypi.org/project/fastreact/"}'::jsonb, null, null, 'pip install fastreact', null, null, '[{"label":"PyPI","href":"https://pypi.org/project/fastreact/"},{"label":"Source on GitHub","href":"https://github.com/RamizMohammad/fastreact"}]'::jsonb, array['One server for the API and the React app, in dev and production', 'fastreact create and fastreact dev: scaffold a Vite app and run both with one command', 'Browser-only React routes, plus Python tracebacks as an in-browser overlay', 'Flask support with pip install fastreact[flask]']::text[], null)
on conflict (slug) do nothing;

commit;
