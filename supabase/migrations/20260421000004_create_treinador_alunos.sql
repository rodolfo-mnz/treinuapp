-- Relacionamento treinador ↔ aluno
CREATE TABLE IF NOT EXISTS treinador_alunos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  treinador_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aluno_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'encerrado')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (treinador_id, aluno_id)
);

-- Convites por e-mail (treinador convida aluno antes de ter conta)
CREATE TABLE IF NOT EXISTS convites (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  treinador_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_aluno  TEXT        NOT NULL,
  token        TEXT        NOT NULL UNIQUE,
  status       TEXT        NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'expirado')),
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treinador_alunos_treinador_id ON treinador_alunos(treinador_id);
CREATE INDEX IF NOT EXISTS idx_treinador_alunos_aluno_id ON treinador_alunos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token);
CREATE INDEX IF NOT EXISTS idx_convites_treinador_id ON convites(treinador_id);

-- RLS
ALTER TABLE treinador_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites          ENABLE ROW LEVEL SECURITY;

-- Treinador vê/gerencia as próprias relações
CREATE POLICY "treinador_gerencia_alunos"
  ON treinador_alunos
  FOR ALL
  USING (auth.uid() = treinador_id)
  WITH CHECK (auth.uid() = treinador_id);

-- Aluno vê o próprio vínculo com o treinador
CREATE POLICY "aluno_ve_proprio_vinculo"
  ON treinador_alunos
  FOR SELECT
  USING (auth.uid() = aluno_id);

-- Treinador gerencia os próprios convites
CREATE POLICY "treinador_gerencia_convites"
  ON convites
  FOR ALL
  USING (auth.uid() = treinador_id)
  WITH CHECK (auth.uid() = treinador_id);

-- Convite acessível via token público (para link de convite)
CREATE POLICY "convite_publico_por_token"
  ON convites
  FOR SELECT
  USING (true);

-- ─── Policies do treinador em treino_sessoes/series ──────────────────────────
-- (movidas aqui pois dependem de treinador_alunos, criada acima)

-- Treinador vê sessões dos seus alunos (leitura)
CREATE POLICY "treinador_ve_sessoes_alunos"
  ON treino_sessoes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM treinador_alunos
      WHERE treinador_id = auth.uid()
        AND aluno_id = treino_sessoes.usuario_id
        AND status = 'ativo'
    )
  );

-- Treinador vê séries dos seus alunos (leitura)
CREATE POLICY "treinador_ve_series_alunos"
  ON treino_series
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM treino_sessoes ts
      JOIN treinador_alunos ta ON ta.aluno_id = ts.usuario_id
      WHERE ts.id = treino_series.sessao_id
        AND ta.treinador_id = auth.uid()
        AND ta.status = 'ativo'
    )
  );

-- ─── RLS em rotinas: treinador pode ler/criar/editar rotinas dos alunos ──────
-- Treinador lê rotinas dos seus alunos
DROP POLICY IF EXISTS "treinador_ve_rotinas_alunos" ON rotinas;
CREATE POLICY "treinador_ve_rotinas_alunos"
  ON rotinas
  FOR SELECT
  USING (
    auth.uid() = usuario_id
    OR auth.uid() = criado_por_treinador_id
    OR EXISTS (
      SELECT 1 FROM treinador_alunos
      WHERE treinador_id = auth.uid()
        AND aluno_id = rotinas.usuario_id
        AND status = 'ativo'
    )
  );

-- RLS em rotinas: treinador pode criar rotinas para seus alunos
DROP POLICY IF EXISTS "treinador_cria_rotina_para_aluno" ON rotinas;
CREATE POLICY "treinador_cria_rotina_para_aluno"
  ON rotinas
  FOR INSERT
  WITH CHECK (
    -- Aluno inserindo sua própria rotina
    auth.uid() = usuario_id
    OR
    -- Treinador criando para seu aluno
    (
      auth.uid() = criado_por_treinador_id
      AND EXISTS (
        SELECT 1 FROM treinador_alunos
        WHERE treinador_id = auth.uid()
          AND aluno_id = rotinas.usuario_id
          AND status = 'ativo'
      )
    )
  );

DROP POLICY IF EXISTS "treinador_edita_rotina_aluno" ON rotinas;
CREATE POLICY "treinador_edita_rotina_aluno"
  ON rotinas
  FOR UPDATE
  USING (
    auth.uid() = usuario_id
    OR auth.uid() = criado_por_treinador_id
    OR EXISTS (
      SELECT 1 FROM treinador_alunos
      WHERE treinador_id = auth.uid()
        AND aluno_id = rotinas.usuario_id
        AND status = 'ativo'
    )
  );
