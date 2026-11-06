-- Portfolio content for mohammadramiz.in.
-- Every fact on the site lives in these tables. The site is static: `npm run build` pulls them
-- through the data API into content/data.json (scripts/pull-content.mjs), so an edit here shows
-- up on the next build. See db/README.md.
--
-- Safe to re-run: everything is created only if missing.

create schema if not exists portfolio;
set search_path to portfolio;

-- Bumps updated_at on every UPDATE, so you can see what changed and when.
create or replace function portfolio.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------- profile (exactly one row)
create table if not exists profile (
  id            smallint primary key default 1 check (id = 1),
  name          text not null,
  first_name    text not null,
  last_name     text not null,
  role          text not null,
  company       text not null,
  location      text not null,
  headline      text not null,
  summary       text not null,
  education     text not null,
  email         text not null,
  phone_display text not null,
  phone_href    text not null,
  resume        text not null,              -- path or URL of the résumé PDF
  site_url      text not null,
  portrait      jsonb not null,             -- {src, width, height, alt}
  interests     text[] not null default '{}',
  updated_at    timestamptz not null default now()
);

create table if not exists profile_links (
  id         serial primary key,
  sort       int not null default 0,
  label      text not null,
  href       text not null,
  handle     text not null,
  updated_at timestamptz not null default now()
);

create table if not exists schooling (
  id         serial primary key,
  sort       int not null default 0,          -- newest first
  degree     text not null,
  school     text not null,
  score      text not null,
  period     text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- experience timeline
create table if not exists timeline (
  id         serial primary key,
  sort       int not null default 0,          -- newest first
  period     text not null,                   -- as shown, e.g. 'Jul 2026 – Present'
  kind       text not null check (kind in ('Work', 'Internship', 'Freelance', 'Independent', 'Education')),
  title      text not null,
  org        text not null,
  span_start numeric(7, 2),                   -- decimal years, used for ordering
  span_end   numeric(7, 2),                   -- null = ongoing
  points     text[] not null default '{}',
  tags       text[],
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- stack, by layer
create table if not exists stack_items (
  id         serial primary key,
  layer      text not null check (layer in ('interface', 'api', 'automation', 'data', 'infra')),
  sort       int not null default 0,
  item       text not null,
  updated_at timestamptz not null default now(),
  unique (layer, item)
);

-- ---------------------------------------------------------------- projects
create table if not exists systems (
  slug         text primary key,              -- also the /work/<slug> URL
  sort         int not null default 0,
  name         text not null,
  summary      text not null,
  domains      text[] not null default '{}',  -- ai | automation | api | tools | apps | infra
  stack        text[] not null default '{}',
  ships_as     text not null,
  platform     text not null check (platform in ('web', 'android', 'desktop', 'service', 'internal')),
  org          text,                          -- e.g. 'Moglix' for work done there
  internal     boolean not null default false,-- internal = no public page or link
  links        jsonb,                         -- [{label, href}]
  logo         text,
  screen       jsonb,                         -- {src, width, height, kind: web|phone}
  points       text[],
  architecture jsonb,                         -- {caption, nodes[], edges[]}
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------- achievements and awards
create table if not exists achievements (
  id         serial primary key,
  sort       int not null default 0,
  kind       text not null check (kind in ('Award', 'Patent', 'Hackathon', 'Competition', 'Certification', 'Internship')),
  title      text not null,
  org        text not null,
  year       text not null,
  status     text not null,
  detail     text,
  image      jsonb,                           -- {src, width, height, alt}
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- photo timeline
create table if not exists moments (
  id         serial primary key,
  when_year  numeric(7, 2) not null,          -- decimal year, only for ordering (oldest first)
  date_label text not null,                   -- as shown, e.g. '27 June 2025'
  place      text not null,
  title      text not null,
  caption    text,
  image      jsonb not null,                  -- {src, width, height, alt}
  fit        text check (fit in ('cover', 'contain')),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- papers, patents, articles
create table if not exists publications (
  id         serial primary key,
  sort       int not null default 0,
  kind       text not null check (kind in ('Journal paper', 'Conference paper', 'Preprint', 'Patent', 'Article')),
  title      text not null,
  authors    text[],                          -- in citation order; null when unknown
  venue      text not null,
  date_label text not null,
  year       int not null,
  id_label   text,                            -- e.g. 'DOI', 'Application No.'
  id_value   text,
  abstract   text not null,
  href       text,
  image      jsonb,
  tags       text[],
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- companies I founded or run
create table if not exists companies (
  id         serial primary key,
  sort       int not null default 0,
  name       text not null,
  tagline    text not null,
  about      text not null,
  role       text not null,                   -- e.g. 'Founder'
  since      text,                            -- as shown, e.g. 'June 2026'
  url        text not null,                   -- the company's website
  tone       text not null default 'violet' check (tone in ('pink', 'lime', 'blue', 'sun', 'violet', 'mint')),
  logo       jsonb,                           -- {src, width, height, alt}; a monogram shows without one
  links      jsonb not null default '[]',     -- [{label, href}] social pages, in display order
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- the /winstore page
create table if not exists store_apps (
  id          serial primary key,
  sort        int not null default 0,
  slug        text not null unique,
  name        text not null,
  kind        text not null check (kind in ('app', 'vscode', 'pip', 'chrome')),
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
  download    jsonb not null,                 -- {label, file, href}: the main Get button (the Windows build, for apps)
  platforms   text[],                         -- operating systems an app runs on: windows, macos, linux; null means windows
  os_downloads jsonb,                         -- {macos?, linux?: {label, file, href, size?}} the Get button on those tabs
  install     text,                           -- optional one-line install command
  steps       text[],                         -- optional manual install steps
  downloads   jsonb,                          -- [{label, file, href}] other packages
  links       jsonb,                          -- [{label, href}] website, releases, source
  features    text[],
  system_slug text,                           -- links to /work/<slug> when set
  updated_at  timestamptz not null default now()
);

-- updated_at triggers on every table
do $$
declare t text;
begin
  foreach t in array array['profile', 'profile_links', 'schooling', 'timeline', 'stack_items', 'systems', 'achievements', 'moments', 'publications', 'companies', 'store_apps'] loop
    execute format('drop trigger if exists touch_updated_at on portfolio.%I', t);
    execute format('create trigger touch_updated_at before update on portfolio.%I for each row execute function portfolio.touch_updated_at()', t);
  end loop;
end $$;
