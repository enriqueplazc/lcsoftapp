-- =====================================================================
--  LC SOFT – Esquema reconstruido para un proyecto Supabase NUEVO
--  Generado a partir del código del frontend (src/) y de supabase_setup.sql
--
--  Cómo usarlo:
--    1. Crea un proyecto nuevo en https://supabase.com
--    2. Abre SQL Editor → New query → pega este archivo completo → Run
--    3. Sigue los "PASOS MANUALES" del final (usuario admin, .env, Edge Function)
--
--  El script es idempotente: puedes ejecutarlo más de una vez sin errores.
--
--  Leyenda:
--    [CÓDIGO]     = deducido directamente del frontend
--    [SUPOSICIÓN] = no se puede saber con certeza desde el código; revisar
-- =====================================================================


-- =====================================================================
-- 0. FUNCIÓN COMÚN: updated_at automático
-- =====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- =====================================================================
-- 1. TABLA: articles  (blog)
--    Usada en: pages/Blog.tsx, sections/Home/Articles.tsx,
--              pages/admin/Articles.tsx, pages/admin/ArticleEditor.tsx,
--              pages/admin/Submissions.tsx, pages/AdminDashboard.tsx
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id                 BIGSERIAL   PRIMARY KEY,                 -- [CÓDIGO] id numérico (Number(id))
  title              TEXT        NOT NULL,                    -- [CÓDIGO]
  slug               TEXT        NOT NULL UNIQUE,             -- [CÓDIGO] requerido en el editor; UNIQUE = [SUPOSICIÓN]
  excerpt            TEXT,                                    -- [CÓDIGO]
  content_md         TEXT,                                    -- [CÓDIGO] Markdown
  main_image_url     TEXT,                                    -- [CÓDIGO]
  status             TEXT        NOT NULL DEFAULT 'draft'     -- [CÓDIGO] 'published' | 'draft'
                     CHECK (status IN ('published', 'draft')),
  published_date     TIMESTAMPTZ,                             -- [CÓDIGO] NULL cuando es borrador
  views              INTEGER     NOT NULL DEFAULT 0,          -- [CÓDIGO]
  author_firstname   TEXT,                                    -- [CÓDIGO]
  author_lastname    TEXT,                                    -- [CÓDIGO]
  author_position    TEXT,                                    -- [CÓDIGO]
  author_avatar_url  TEXT,                                    -- [CÓDIGO]
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),      -- [SUPOSICIÓN] estándar
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()       -- [SUPOSICIÓN] estándar
);

CREATE INDEX IF NOT EXISTS idx_articles_status_date
  ON public.articles (status, published_date DESC);           -- listados por estado y fecha

DROP TRIGGER IF EXISTS articles_updated_at ON public.articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =====================================================================
-- 2. TABLA: article_submissions  (artículos enviados para revisión)
--    Usada en: pages/admin/Submissions.tsx, pages/AdminDashboard.tsx,
--              pages/SubmitArticle.tsx (hoy comentado)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.article_submissions (
  id              BIGSERIAL   PRIMARY KEY,                    -- [CÓDIGO]
  title           TEXT        NOT NULL,                       -- [CÓDIGO]
  slug            TEXT        NOT NULL,                       -- [CÓDIGO] (no único: se valida al aprobar)
  excerpt         TEXT,                                       -- [CÓDIGO]
  content_md      TEXT,                                       -- [CÓDIGO]
  temp_image_url  TEXT,                                       -- [CÓDIGO]
  status          TEXT        NOT NULL DEFAULT 'pending'      -- [CÓDIGO] pending | approved | rejected
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()          -- [CÓDIGO] se ordena por created_at
);

CREATE INDEX IF NOT EXISTS idx_submissions_status_created
  ON public.article_submissions (status, created_at DESC);


-- =====================================================================
-- 3. TABLA: clients  (clientes mostrados en la Home y gestionados en /admin/clients)
--    Usada en: api/clients.ts, pages/admin/Clients.tsx, pages/admin/ClientEditor.tsx,
--              sections/Home/Clients.tsx
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id                BIGSERIAL   PRIMARY KEY,                  -- [CÓDIGO]
  name              TEXT        NOT NULL,                     -- [CÓDIGO]
  logo_url          TEXT,                                     -- [CÓDIGO]
  sector            TEXT        NOT NULL,                     -- [CÓDIGO]
  blurb             TEXT        NOT NULL,                     -- [CÓDIGO] descripción corta
  details           TEXT,                                     -- [CÓDIGO] descripción larga
  url               TEXT,                                     -- [CÓDIGO] web del cliente
  gradient_class    TEXT        NOT NULL DEFAULT 'from-[#542DA0] to-[#8887E8]', -- [CÓDIGO]
  order_index       INTEGER     NOT NULL DEFAULT 0,           -- [CÓDIGO]
  is_active         BOOLEAN     NOT NULL DEFAULT true,        -- [CÓDIGO] soft delete
  contact_name      TEXT,                                     -- [CÓDIGO] falta en supabase_setup.sql
  contact_position  TEXT,                                     -- [CÓDIGO] falta en supabase_setup.sql
  contact_phone     TEXT,                                     -- [CÓDIGO] falta en supabase_setup.sql
  contact_email     TEXT,                                     -- [CÓDIGO] falta en supabase_setup.sql
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),       -- [CÓDIGO]
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()        -- [CÓDIGO]
);

-- Por si la tabla ya existía sin las columnas de contacto:
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_name     TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_position TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_phone    TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_email    TEXT;

CREATE INDEX IF NOT EXISTS idx_clients_active_order
  ON public.clients (is_active, order_index);

DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =====================================================================
-- 4. RPC: increment_article_views(row_id)
--    Usada en: pages/Blog.tsx → supabase.rpc("increment_article_views", { row_id })
--    SECURITY DEFINER para que un visitante anónimo pueda sumar una vista
--    sin tener permiso general de UPDATE sobre articles.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.increment_article_views(row_id BIGINT)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.articles
     SET views = views + 1
   WHERE id = row_id
     AND status = 'published';
$$;

REVOKE ALL ON FUNCTION public.increment_article_views(BIGINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_article_views(BIGINT) TO anon, authenticated;


-- =====================================================================
-- 5. ROW LEVEL SECURITY
--    Modelo deducido del código: el sitio público solo lee; cualquier
--    usuario con sesión (login en /login) es administrador.
--    [SUPOSICIÓN] No hay roles en el código: "autenticado = admin".
--    Por eso es IMPORTANTE desactivar el registro público (ver pasos manuales).
-- =====================================================================

-- ---------- articles ----------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "articles_public_read" ON public.articles;
CREATE POLICY "articles_public_read"
  ON public.articles FOR SELECT
  TO anon
  USING (status = 'published');

DROP POLICY IF EXISTS "articles_admin_all" ON public.articles;
CREATE POLICY "articles_admin_all"
  ON public.articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------- article_submissions ----------
ALTER TABLE public.article_submissions ENABLE ROW LEVEL SECURITY;

-- [SUPOSICIÓN] El formulario público de envío está comentado en el código.
-- Se deja permitido insertar (solo en estado 'pending') por si lo reactivas.
DROP POLICY IF EXISTS "submissions_public_insert" ON public.article_submissions;
CREATE POLICY "submissions_public_insert"
  ON public.article_submissions FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "submissions_admin_all" ON public.article_submissions;
CREATE POLICY "submissions_admin_all"
  ON public.article_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------- clients ----------
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_public_read" ON public.clients;
CREATE POLICY "clients_public_read"
  ON public.clients FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "clients_admin_all" ON public.clients;
CREATE POLICY "clients_admin_all"
  ON public.clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- 5b. PROTECCIÓN DE LOS DATOS DE CONTACTO DE CLIENTES
--     La Home muestra el contacto "ofuscado" (solo nombre de pila, 3 dígitos
--     del teléfono y la terminación del email) y el contacto completo solo
--     después de pasar reCAPTCHA (Edge Function reveal-contact).
--     Para que los datos completos NO lleguen al navegador:
--       - columnas calculadas con las pistas ofuscadas
--       - el rol anónimo solo puede leer columnas seguras
-- =====================================================================
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS has_contact BOOLEAN
  GENERATED ALWAYS AS (COALESCE(contact_name, contact_phone, contact_email) IS NOT NULL) STORED;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_first_name TEXT
  GENERATED ALWAYS AS (NULLIF(split_part(btrim(contact_name), ' ', 1), '')) STORED;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_phone_hint TEXT
  GENERATED ALWAYS AS (NULLIF(left(regexp_replace(contact_phone, '\D', '', 'g'), 3), '')) STORED;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contact_email_tld TEXT
  GENERATED ALWAYS AS (substring(contact_email FROM '\.([^.@]+)$')) STORED;

REVOKE SELECT ON public.clients FROM anon;
GRANT SELECT (
  id, name, logo_url, sector, blurb, details, url, gradient_class,
  order_index, is_active, contact_position,
  has_contact, contact_first_name, contact_phone_hint, contact_email_tld,
  created_at, updated_at
) ON public.clients TO anon;
-- Los usuarios autenticados (admin) siguen viendo todas las columnas.
-- La Edge Function reveal-contact lee el contacto completo con la service role key.


-- =====================================================================
-- 6. REALTIME
--    Usado en: Submissions.tsx y AdminDashboard.tsx →
--    supabase.channel(...).on("postgres_changes", { table: "article_submissions" })
-- =====================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime'
       AND schemaname = 'public'
       AND tablename = 'article_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.article_submissions;
  END IF;
END $$;


-- =====================================================================
-- 7. STORAGE (buckets)
--    "images"  [CÓDIGO] ArticleEditor.tsx → images/articles/...
--                        ClientEditor.tsx  → images/clients/...
--              Usa getPublicUrl → el bucket debe ser PÚBLICO.
--    "clients" [CÓDIGO] api/clients.ts uploadClientLogo() → clients/logos/...
--              (la función existe pero la pantalla usa "images"; se crea por si acaso)
--    "blog"    [CÓDIGO] solo en SubmitArticle.tsx (comentado) → submissions/...
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('images',  'images',  true, 5242880, ARRAY['image/png','image/jpeg','image/webp','image/gif','image/svg+xml']),
  ('clients', 'clients', true, 2097152, ARRAY['image/png','image/jpeg','image/webp','image/gif','image/svg+xml']),
  ('blog',    'blog',    true, 5242880, ARRAY['image/png','image/jpeg','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
-- Límites: 5 MB artículos y 2 MB logos, igual que las validaciones del frontend.

-- Lectura pública de los tres buckets
DROP POLICY IF EXISTS "lc_public_read_images" ON storage.objects;
CREATE POLICY "lc_public_read_images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('images', 'clients', 'blog'));

-- Admin (autenticado): subir, reemplazar y borrar en images y clients
DROP POLICY IF EXISTS "lc_admin_insert_images" ON storage.objects;
CREATE POLICY "lc_admin_insert_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('images', 'clients', 'blog'));

DROP POLICY IF EXISTS "lc_admin_update_images" ON storage.objects;
CREATE POLICY "lc_admin_update_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('images', 'clients', 'blog'))
  WITH CHECK (bucket_id IN ('images', 'clients', 'blog'));

DROP POLICY IF EXISTS "lc_admin_delete_images" ON storage.objects;
CREATE POLICY "lc_admin_delete_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('images', 'clients', 'blog'));

-- [SUPOSICIÓN] Envío público de imágenes al bucket "blog/submissions/".
-- Solo hace falta si reactivas SubmitArticle.tsx. Descomenta entonces:
-- CREATE POLICY "lc_anon_upload_submissions"
--   ON storage.objects FOR INSERT
--   TO anon
--   WITH CHECK (bucket_id = 'blog' AND (storage.foldername(name))[1] = 'submissions');


-- =====================================================================
-- 8. DATOS INICIALES  (copiados de supabase_setup.sql)
--    Los artículos reales se perdieron con el proyecto anterior. Los clientes,
--    sus logos y contactos salen del repo y del documento "Nuestros Clientes".
-- =====================================================================
INSERT INTO public.articles
  (title, slug, excerpt, content_md, status, published_date,
   author_firstname, author_lastname, author_position)
VALUES (
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
  'published', NOW(),
  'Equipo', 'LC Soft', 'Redacción'
)
ON CONFLICT (slug) DO NOTHING;

-- Solo inserta los clientes si la tabla está vacía (evita duplicados al re-ejecutar)
INSERT INTO public.clients (name, logo_url, sector, blurb, gradient_class, order_index)
SELECT v.name, v.logo_url, v.sector, v.blurb, v.gradient_class, v.order_index
FROM (VALUES
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
) AS v(name, logo_url, sector, blurb, gradient_class, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.clients);
-- Los logos de estas rutas están en public/logos/ (sacados del documento
-- "LCSoft - Nuestros Clientes"), así que se sirven desde la propia web.

-- Contactos de referencia, del documento "LCSoft - Nuestros Clientes".
-- Se identifican por logo_url y solo se rellenan si el cliente aún no tiene contacto,
-- así que no pisa lo que edites luego en /admin/clients. Ese documento no trae emails.
UPDATE public.clients AS c
   SET contact_name     = v.contact_name,
       contact_position = v.contact_position,
       contact_phone    = v.contact_phone
  FROM (VALUES
    ('/logos/geshouba.png',         'Patricia Aldana',           'Coordinadora de Nóminas', '939 289 155'),
    ('/logos/sinohydro.png',        'Martín Lázaro Celadita',    'Coordinador de Nóminas',  '914 430 457'),
    ('/logos/collique.png',         'Marixa Caballero Ortiz',    'Contadora General (CPC)', '962 833 156'),
    ('/logos/ferralia.png',         'Enrique de la Cruz',        'Coordinador de Nóminas',  '994 850 270'),
    ('/logos/malaga.png',           'Rosy Maraví',               'Jefa de RR.HH.',          '990 010 545'),
    ('/logos/ersindustries.png',    'Alfredo Narváez',           'Gerente de RR.HH.',       '942 302 713'),
    ('/logos/eom.png',              'Cristian Córdova',          'Coordinador de Planillas','998 171 240'),
    ('/logos/aceros-concretos.png', 'Giovanna Punchín',          'Contadora General',       '987 968 113'),
    ('/logos/eb-consorcio.png',     'Rosalyn Benites',           'Coordinadora de Nóminas', '993 903 083'),
    ('/logos/urci.png',             'Karen Quinaya',             'Jefa de RR.HH.',          '986 386 038'),
    ('/logos/jagui.png',            'Diana Osorio',              'Jefa de Nóminas',         '994 331 100'),
    ('/logos/echeverria.png',       'Miguel Pérez Sandoval',     'Jefe de RR.HH.',          '987 813 837'),
    ('/logos/pissano.png',          'Alessandra',                'Coordinadora de Nóminas', '938 876 954'),
    ('/logos/bps.png',              'Patricia Portocarrero',     'Gerente General (CPC)',   '976 226 251'),
    ('/logos/terramove.png',        'Verónica Recuay',           'Jefa de RR.HH.',          '914 256 793'),
    ('/logos/matellini.png',        'Jessica Rojas',             'Contadora General (CPC)', '996 474 817'),
    ('/logos/avanza.png',           'Ana María Galarza',         'Gerente',                 '922 010 982'),
    -- [REVISAR] En el documento CORBUS tiene el mismo número que Avanza (922 010 982)
    ('/logos/corbus.png',           'Jazmin Puppi',              'Coordinadora de Nóminas', '922 010 982'),
    ('/logos/macontra.png',         'Luis Ugarte',               'Jefe de RR.HH.',          '996 607 739')
  ) AS v(logo_url, contact_name, contact_position, contact_phone)
 WHERE c.logo_url = v.logo_url
   AND c.contact_name IS NULL
   AND c.contact_phone IS NULL
   AND c.contact_email IS NULL;


-- =====================================================================
--  PASOS MANUALES (no se pueden hacer con SQL)
-- =====================================================================
--  1. Usuario administrador:
--     Authentication → Users → "Add user" → email + contraseña
--     (marca "Auto Confirm User"). Con ese usuario entras en /login.
--
--  2. Desactivar registro público (MUY recomendado, porque aquí
--     "autenticado = admin"):
--     Authentication → Sign In / Providers → desactiva "Allow new users to sign up".
--
--  3. Variables de entorno del frontend (.env y secrets de GitHub Actions):
--     VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY → copiar del nuevo proyecto
--     (Project Settings → API). No subas estas claves a ningún sitio público.
--
--  4. Edge Function "reveal-contact" (botón "Ver contacto completo"):
--     Código en supabase/functions/reveal-contact/index.ts. Desplegar con:
--       npx supabase login
--       npx supabase link --project-ref <ref-del-proyecto-nuevo>
--       npx supabase secrets set RECAPTCHA_SECRET_KEY=<tu clave secreta de reCAPTCHA v3>
--       npx supabase functions deploy reveal-contact --no-verify-jwt
--
--  5. Edge Function "send-contact" (formulario de /contact):
--     El frontend hace POST a  {VITE_SUPABASE_URL}/functions/v1/send-contact
--     con JSON: { tipo, nombre, email, telefono, empresa, mensaje, captchaToken }
--     y espera { error } si falla. Su código NO está en esta carpeta, así que
--     hay que volver a escribirla y desplegarla (verificar reCAPTCHA + enviar
--     email, probablemente con Resend). Necesitará sus propios secrets
--     (clave secreta de reCAPTCHA, API key del proveedor de email).
-- =====================================================================
