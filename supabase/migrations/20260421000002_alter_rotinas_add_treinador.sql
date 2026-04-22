-- Permite que treinadores criem rotinas para seus alunos
ALTER TABLE rotinas
  ADD COLUMN IF NOT EXISTS criado_por_treinador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN rotinas.criado_por_treinador_id IS 'ID do personal trainer que criou esta rotina (NULL = criada pelo próprio atleta)';
