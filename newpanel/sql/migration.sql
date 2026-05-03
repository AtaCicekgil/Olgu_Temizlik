-- ============================================================
-- Newpanel (np_) tabloları migration
-- Eski panel tablolarına dokunmaz — tamamen bağımsız.
-- ============================================================

-- np_musteriler
create table if not exists np_musteriler (
  id             bigint generated always as identity primary key,
  ad             text not null,
  tel            text,
  tipi           text not null default 'bireysel' check (tipi in ('bireysel','kurumsal')),
  adres_mahalle  text,
  adres_sokak    text,
  adres_bina     text,
  adres_daire    text,
  notlar         text,
  created_at     timestamptz not null default now()
);

-- np_cinsler (halı cinsleri)
create table if not exists np_cinsler (
  id         bigint generated always as identity primary key,
  ad         text not null unique,
  fiyat      numeric(10,2),
  fiyat_tip  text not null default 'm2' check (fiyat_tip in ('m2','sabit')),
  aktif      boolean not null default true
);

-- Varsayılan cinsler
insert into np_cinsler (ad, fiyat, fiyat_tip) values
  ('Makine', 80, 'm2'),
  ('Yün', 120, 'm2'),
  ('Shaggy', 100, 'm2'),
  ('İpek', 150, 'm2'),
  ('Koltuk', 500, 'sabit'),
  ('Perde', 200, 'sabit')
on conflict (ad) do nothing;

-- np_siparisler
create table if not exists np_siparisler (
  id             bigint generated always as identity primary key,
  musteri_id     bigint not null references np_musteriler(id),
  durum          text not null default 'alinacak'
                   check (durum in ('alinacak','alindi','yikanıyor','hazir','dagitimda','teslim')),
  servis_tip     text not null default 'hali' check (servis_tip in ('hali','koltuk','perde')),
  tarih          date,
  teslim_tarihi  date,
  odeme_tarih    date,
  odeme_yontemi  text check (odeme_yontemi in ('nakit','havale')),
  odendi         boolean not null default false,
  siparis_notu   text,
  olusturma      timestamptz not null default now()
);

-- np_siparis_kalemleri
create table if not exists np_siparis_kalemleri (
  id           bigint generated always as identity primary key,
  siparis_id   bigint not null references np_siparisler(id) on delete cascade,
  cins_id      bigint references np_cinsler(id),
  adet         integer not null default 1,
  m2           numeric(8,2),
  m2_sonra     boolean not null default false,
  birim_fiyat  numeric(10,2),
  ozel_fiyat   numeric(10,2),
  toplam       numeric(10,2)
);

-- np_giderler
create table if not exists np_giderler (
  id         bigint generated always as identity primary key,
  kategori   text not null,
  tutar      numeric(10,2) not null,
  tarih      date not null default current_date,
  aciklama   text,
  created_at timestamptz not null default now()
);

-- ── RLS (Row Level Security) ──────────────────────────────────────────────────
-- Paneli tek kullanıcı kullandığı için public read/write yeterli.
-- Üretimde Supabase Auth ile kısıtlanmalı.

alter table np_musteriler      enable row level security;
alter table np_cinsler         enable row level security;
alter table np_siparisler      enable row level security;
alter table np_siparis_kalemleri enable row level security;
alter table np_giderler        enable row level security;

-- Tüm işlemlere izin ver (anon key ile erişim — gerekirse auth ile kısıtla)
create policy "np_musteriler_all"       on np_musteriler       for all using (true) with check (true);
create policy "np_cinsler_all"          on np_cinsler          for all using (true) with check (true);
create policy "np_siparisler_all"       on np_siparisler       for all using (true) with check (true);
create policy "np_siparis_kalemleri_all" on np_siparis_kalemleri for all using (true) with check (true);
create policy "np_giderler_all"         on np_giderler         for all using (true) with check (true);

-- ── İndeksler ─────────────────────────────────────────────────────────────────
create index if not exists idx_np_siparisler_musteri  on np_siparisler(musteri_id);
create index if not exists idx_np_siparisler_durum    on np_siparisler(durum);
create index if not exists idx_np_siparisler_olusturma on np_siparisler(olusturma desc);
create index if not exists idx_np_kalemler_siparis    on np_siparis_kalemleri(siparis_id);
create index if not exists idx_np_giderler_tarih      on np_giderler(tarih desc);
