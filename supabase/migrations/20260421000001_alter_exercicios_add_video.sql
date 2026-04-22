-- Adiciona suporte a vídeo/thumbnail nos exercícios
ALTER TABLE exercicios
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

COMMENT ON COLUMN exercicios.video_url IS 'URL do vídeo de demonstração no Supabase Storage';
COMMENT ON COLUMN exercicios.thumbnail_url IS 'URL da thumbnail do vídeo no Supabase Storage';
