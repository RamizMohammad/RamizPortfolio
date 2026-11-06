-- 2026-11-06: Mac and Linux tabs on /winstore. Each app lists the operating systems it runs on,
-- and can point those tabs at their own build. Run after 2026-11-06-vscode-extensions.sql.

begin;

alter table portfolio.store_apps add column if not exists platforms text[];
alter table portfolio.store_apps add column if not exists os_downloads jsonb;

update portfolio.store_apps set platforms = array['windows']::text[] where kind = 'app' and platforms is null;
update portfolio.store_apps
   set platforms = array['windows', 'linux']::text[],
       os_downloads = '{"linux":{"label":"Debian / Ubuntu","file":"bakup_0.1.0_all.deb","href":"https://github.com/RamizMohammad/Bakup-Release/releases/download/backup-v1.0/bakup_0.1.0_all.deb"}}'::jsonb,
       requires = 'Windows 10 or 11, or Debian / Ubuntu · your own bakup server (Docker) for sync'
 where slug = 'bakup';

commit;
