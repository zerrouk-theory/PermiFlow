insert into public.users (id, email, name, balance)
values
  ('00000000-0000-0000-0000-000000000001', 'aminata@example.com', 'Aminata L.', 1200),
  ('00000000-0000-0000-0000-000000000002', 'lucas@example.com', 'Lucas P.', 540)
on conflict (id) do nothing;

insert into public.towns (iris_code, name, region, permits, score)
values
  ('751010101', 'Paris 10 — Château d''Eau', 'Île-de-France', 143, 88),
  ('693870504', 'Lyon — Confluence', 'Auvergne-Rhône-Alpes', 97, 72),
  ('341720301', 'Montpellier — Port Marianne', 'Occitanie', 81, 64)
on conflict (iris_code) do update
  set permits = excluded.permits,
      score = excluded.score;

insert into public.bets (id, user_id, town_id, direction, amount, odds, expiry)
select
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  id,
  'UP',
  150,
  1.9,
  current_date + interval '45 days'
from public.towns
limit 1;
