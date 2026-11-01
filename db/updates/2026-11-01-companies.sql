-- 2026-11-01: add the companies table (Companies section) and fill it with Loopax and Confess.
-- Run once against the live database with a key that can create tables, then rebuild the site.

set search_path = portfolio;

begin;

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

drop trigger if exists touch_updated_at on portfolio.companies;
create trigger touch_updated_at before update on portfolio.companies for each row execute function portfolio.touch_updated_at();

insert into portfolio.companies (sort, name, tagline, about, role, since, url, tone, logo, links) values
  (0, 'Loopax Technologies', 'Building technology that solves real problems.', 'A technology company building custom software, Android apps, backend systems, cloud infrastructure and automation tools for startups and enterprises.', 'Founder', 'June 2026', 'https://www.loopax.online/', 'violet', null, '[{"label":"LinkedIn","href":"https://www.linkedin.com/company/loopax-technologies/"}]'::jsonb),
  (1, 'Confess', 'Say the thing you can''t say out loud.', 'An anonymous space to write about what''s weighing on you and hear from people who have felt the same, with real-time feeds and reactions. Free on Google Play, for adults 18+.', 'Creator', null, 'https://www.confessapp.in/', 'pink', '{"src":"/images/logos/confess-app.webp","width":96,"height":96,"alt":"Confess logo"}'::jsonb, '[{"label":"Instagram","href":"https://www.instagram.com/getconfess/"},{"label":"LinkedIn","href":"https://www.linkedin.com/company/getconfess/"},{"label":"WhatsApp channel","href":"https://whatsapp.com/channel/0029Vb9cCcyFSAsv8FpC1G2F"},{"label":"X","href":"https://x.com/get_confess"}]'::jsonb);

commit;
