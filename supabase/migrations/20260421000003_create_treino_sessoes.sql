-- Sessões de treino: registra cada vez que um aluno realiza um treino
CREATE TABLE IF NOT EXISTS treino_sessoes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rotina_dia_id     UUID        NOT NULL REFERENCES rotina_dias(id) ON DELETE RESTRICT,
  iniciado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalizado_em     TIMESTAMPTZ,
  duracao_segundos  INTEGER,
  observacao        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Séries executadas: cada série de cada exercício dentro de uma sessão
-- Suporta pesos diferentes por série (carga_kg por linha)
CREATE TABLE IF NOT EXISTS treino_series (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id     UUID        NOT NULL REFERENCES treino_sessoes(id) ON DELETE CASCADE,
  exercicio_id  UUID        NOT NULL REFERENCES exercicios(id) ON DELETE RESTRICT,
  numero_serie  INTEGER     NOT NULL CHECK (numero_serie >= 1),
  repeticoes    INTEGER     CHECK (repeticoes >= 0),
  carga_kg      DECIMAL(6,2) CHECK (carga_kg >= 0),
  completada    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_treino_sessoes_usuario_id ON treino_sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_treino_sessoes_rotina_dia_id ON treino_sessoes(rotina_dia_id);
CREATE INDEX IF NOT EXISTS idx_treino_sessoes_iniciado_em ON treino_sessoes(iniciado_em DESC);
CREATE INDEX IF NOT EXISTS idx_treino_series_sessao_id ON treino_series(sessao_id);
CREATE INDEX IF NOT EXISTS idx_treino_series_exercicio_id ON treino_series(exercicio_id);

-- RLS
ALTER TABLE treino_sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE treino_series  ENABLE ROW LEVEL SECURITY;

-- Atleta vê/cria/atualiza apenas as próprias sessões
CREATE POLICY "atleta_gerencia_proprias_sessoes"
  ON treino_sessoes
  FOR ALL
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Atleta gerencia as próprias séries (via sessão)
CREATE POLICY "atleta_gerencia_proprias_series"
  ON treino_series
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM treino_sessoes
      WHERE id = treino_series.sessao_id
        AND usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM treino_sessoes
      WHERE id = treino_series.sessao_id
        AND usuario_id = auth.uid()
    )
  );

-- NOTA: policies do treinador para sessoes/series ficam na migração 000004,
-- pois dependem da tabela treinador_alunos criada lá.
