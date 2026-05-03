-- ============================================================
-- Newpanel migration v2
-- Yeni tablolar + mevcut tablolara kolon eklemeleri
-- ============================================================

-- np_siparisler'e yeni kolonlar
alter table np_siparisler add column if not exists indirim_tutar    numeric(10,2);
alter table np_siparisler add column if not exists ek_ucret         numeric(10,2);
alter table np_siparisler add column if not exists ek_ucret_aciklama text;
alter table np_siparisler add column if not exists personel_id      bigint;

-- np_personel
create table if not exists np_personel (
  id         bigint generated always as identity primary key,
  ad         text not null,
  tel        text,
  rol        text default 'teknisyen',
  aktif      boolean not null default true,
  created_at timestamptz not null default now()
);

-- np_siparisler personel FK (tablo oluştuktan sonra)
do $$ begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'np_siparisler_personel_id_fkey'
  ) then
    alter table np_siparisler add constraint np_siparisler_personel_id_fkey
      foreign key (personel_id) references np_personel(id) on delete set null;
  end if;
end $$;

-- np_stok
create table if not exists np_stok (
  id          bigint generated always as identity primary key,
  ad          text not null,
  kategori    text,
  miktar      numeric(10,2) not null default 0,
  birim       text not null default 'adet',
  min_miktar  numeric(10,2) not null default 0,
  fiyat       numeric(10,2),
  created_at  timestamptz not null default now()
);

-- np_ayarlar (key-value)
create table if not exists np_ayarlar (
  id          bigint generated always as identity primary key,
  anahtar     text unique not null,
  deger       text,
  guncellendi timestamptz not null default now()
);

insert into np_ayarlar (anahtar, deger) values
  ('isletme_ad',       'Olgu Temizlik'),
  ('isletme_tel',      '05332002662'),
  ('isletme_sehir',    'Ankara'),
  ('teslim_suresi_gun','3'),
  ('calisma_baslangic','08:00'),
  ('calisma_bitis',    '18:00')
on conflict (anahtar) do nothing;

-- np_sms_sablon
create table if not exists np_sms_sablon (
  id         bigint generated always as identity primary key,
  kod        text unique not null,
  baslik     text not null,
  metin      text not null,
  aktif      boolean not null default true,
  created_at timestamptz not null default now()
);

-- np_hatirlatici
create table if not exists np_hatirlatici (
  id          bigint generated always as identity primary key,
  siparis_id  bigint references np_siparisler(id) on delete cascade,
  tarih       date not null,
  hatirlatici_notu text,
  tamamlandi  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table np_personel   enable row level security;
alter table np_stok       enable row level security;
alter table np_ayarlar    enable row level security;
alter table np_sms_sablon enable row level security;
alter table np_hatirlatici enable row level security;

create policy "np_personel_all"    on np_personel    for all using (true) with check (true);
create policy "np_stok_all"        on np_stok        for all using (true) with check (true);
create policy "np_ayarlar_all"     on np_ayarlar     for all using (true) with check (true);
create policy "np_sms_sablon_all"  on np_sms_sablon  for all using (true) with check (true);
create policy "np_hatirlatici_all" on np_hatirlatici for all using (true) with check (true);

-- ── İndeksler ─────────────────────────────────────────────────────────────────
create index if not exists idx_np_siparisler_personel on np_siparisler(personel_id);
create index if not exists idx_np_hatirlatici_tarih   on np_hatirlatici(tarih);
create index if not exists idx_np_hatirlatici_siparis on np_hatirlatici(siparis_id);
