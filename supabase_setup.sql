-- ============================================================
--  LC SOFT – Script de reconstrucción de base de datos
--  Ejecuta esto en el SQL Editor de Supabase
--  https://app.supabase.com → tu proyecto → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- 1. TABLA: articles  (artículos publicados)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id                  BIGSERIAL PRIMARY KEY,
  title               TEXT        NOT NULL,
  slug                TEXT        UNIQUE NOT NULL,
  excerpt             TEXT,
  content_md          TEXT,
  main_image_url      TEXT,
  status              TEXT        NOT NULL DEFAULT 'published',
  published_date      TIMESTAMPTZ DEFAULT NOW(),
  views               INTEGER     NOT NULL DEFAULT 0,

  -- Autor (opcional, desnormalizado para simplicidad)
  author_firstname    TEXT,
  author_lastname     TEXT,
  author_position     TEXT,
  author_avatar_url   TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 2. TABLA: article_submissions  (borradores enviados por usuarios)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_submissions (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT    NOT NULL,
  slug            TEXT    NOT NULL,
  excerpt         TEXT,
  content_md      TEXT,
  temp_image_url  TEXT,
  status          TEXT    NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. FUNCIÓN: increment_article_views
--    Incrementa el contador de vistas de forma atómica
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_article_views(row_id BIGINT)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE public.articles
  SET views = views + 1
  WHERE id = row_id;
$$;

-- ─────────────────────────────────────────
-- 4. TRIGGER: updated_at automático
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- articles: lectura pública, escritura solo autenticados
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_public_read"
  ON public.articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "articles_admin_all"
  ON public.articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- article_submissions: cualquiera puede insertar, solo admin lee/modifica
ALTER TABLE public.article_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions_public_insert"
  ON public.article_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "submissions_admin_all"
  ON public.article_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────
-- 6. DATOS DE EJEMPLO (opcional)
-- ─────────────────────────────────────────
INSERT INTO public.articles
  (title, slug, excerpt, content_md, status, author_firstname, author_lastname, author_position)
VALUES
  (
    'Bienvenidos al blog de LC Soft',
    'bienvenidos-al-blog',
    'Primer artículo de ejemplo en el blog de LC Soft.',
    '# Bienvenidos al blog de LC Soft

Este es el primer artículo del blog. Aquí compartiremos noticias, tutoriales y novedades sobre nuestros productos y servicios.

## ¿Qué encontrarás aquí?

- Novedades de nuestros módulos
- Casos de éxito de clientes
- Tutoriales y guías de uso

¡Gracias por visitarnos!',
    'published',
    'Equipo',
    'LC Soft',
    'Redacción'
  )
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
--  LC SOFT – Tabla de Clientes
--  Ejecuta esto en el SQL Editor de Supabase
-- ============================================================

-- ─────────────────────────────────────────
-- TABLA: clients (clientes de la empresa)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clients (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT        NOT NULL,
  logo_url            TEXT,
  sector              TEXT        NOT NULL,
  blurb               TEXT        NOT NULL,  -- descripción corta
  details             TEXT,                   -- descripción larga (opcional)
  url                 TEXT,                   -- sitio web del cliente (opcional)
  gradient_class      TEXT        DEFAULT 'from-[#542DA0] to-[#8887E8]',
  order_index         INTEGER     NOT NULL DEFAULT 0,  -- para ordenar manualmente
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TRIGGER: updated_at automático
-- ─────────────────────────────────────────
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- clients: lectura pública (solo activos), escritura solo admin
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_public_read"
  ON public.clients FOR SELECT
  USING (is_active = true);

CREATE POLICY "clients_admin_all"
  ON public.clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────
-- ÍNDICES para mejor rendimiento
-- ─────────────────────────────────────────
CREATE INDEX idx_clients_active ON public.clients(is_active);
CREATE INDEX idx_clients_order ON public.clients(order_index);

-- ─────────────────────────────────────────
-- DATOS INICIALES (19 clientes)
-- ─────────────────────────────────────────
INSERT INTO public.clients (name, logo_url, sector, blurb, gradient_class, order_index) VALUES
  ('China Geshouba Group', '/logos/geshouba.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#06b6d4] to-[#0ea5e9]', 1),
  ('Sinohydro Corporation', '/logos/sinohydro.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#10b981] to-[#4ade80]', 2),
  ('Consorcio Saneamiento Collique II', '/logos/collique.png', 'Construcción Civil', 'TDIPLAN v5.0 + Aplicación de Almacén de Obras TDIALM v5.0', 'from-[#8887E8] to-[#a855f7]', 3),
  ('Ferralia Perú SAC', '/logos/ferralia.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#542DA0] to-[#3b82f6]', 4),
  ('Constructora Málaga Hnos.', '/logos/malaga.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#f59e0b] to-[#fbbf24]', 5),
  ('Ersindustries Perú SAC', '/logos/ersindustries.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#ef4444] to-[#f97316]', 6),
  ('EOM Grupo', '/logos/eom.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#14b8a6] to-[#06b6d4]', 7),
  ('Aceros y Concretos S.A.C.', '/logos/aceros-concretos.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#6366f1] to-[#8b5cf6]', 8),
  ('EB Consorcio Gestor', '/logos/eb-consorcio.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#ec4899] to-[#d946ef]', 9),
  ('URCI Consultores S.L.', '/logos/urci.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General TDIPLAN v5.0', 'from-[#06b6d4] to-[#3b82f6]', 10),
  ('Jagui Sac Contratistas', '/logos/jagui.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#8b5cf6] to-[#ec4899]', 11),
  ('Echeverría Izquierdo Montajes', '/logos/echeverria.png', 'Construcción Civil', 'Aplicación de Planillas de Construcción Civil TDIPLAN v5.0', 'from-[#f59e0b] to-[#ef4444]', 12),
  ('Consorcio Pissano SAC', '/logos/pissano.png', 'Construcción Civil', 'Aplicación de Planillas de Construcción Civil TDIPLAN v5.0', 'from-[#10b981] to-[#06b6d4]', 13),
  ('BPS Asesores y Consultores', '/logos/bps.png', 'Consultoría Contable', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#d946ef] to-[#8b5cf6]', 14),
  ('Terramove SAC', '/logos/terramove.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#0ea5e9] to-[#8b5cf6]', 15),
  ('Enrique Matellini Vidal Ings.', '/logos/matellini.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#ef4444] to-[#ec4899]', 16),
  ('Avanza Tecnología y Serv SAC', '/logos/avanza.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#4ade80] to-[#14b8a6]', 17),
  ('CORBUS Edificaciones SAC', '/logos/corbus.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#a855f7] to-[#3b82f6]', 18),
  ('Macontra Mineria y Construcción', '/logos/macontra.png', 'Construcción Civil', 'Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0', 'from-[#fbbf24] to-[#f97316]', 19)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ✅ Listo! Ahora puedes gestionar clientes desde el panel admin
-- ============================================================