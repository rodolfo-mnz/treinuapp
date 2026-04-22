-- Planos de assinatura disponíveis
CREATE TABLE IF NOT EXISTS planos (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         TEXT         NOT NULL,
  tipo         TEXT         NOT NULL CHECK (tipo IN ('atleta', 'personal')),
  preco_mensal DECIMAL(10,2) NOT NULL,
  max_alunos   INTEGER,      -- NULL = ilimitado (só para planos personal)
  max_rotinas  INTEGER,      -- NULL = ilimitado
  features     JSONB,        -- lista de features em texto para exibição
  ativo        BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Assinaturas dos usuários
CREATE TABLE IF NOT EXISTS assinaturas (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id                UUID        NOT NULL REFERENCES planos(id) ON DELETE RESTRICT,
  status                  TEXT        NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado', 'expirado', 'trial')),
  periodo_inicio          TIMESTAMPTZ NOT NULL,
  periodo_fim             TIMESTAMPTZ,
  gateway                 TEXT        CHECK (gateway IN ('mercadopago', 'stripe')),
  gateway_subscription_id TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario_id ON assinaturas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);

-- RLS
ALTER TABLE planos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas  ENABLE ROW LEVEL SECURITY;

-- Planos são públicos (leitura)
CREATE POLICY "planos_publicos"
  ON planos
  FOR SELECT
  USING (ativo = TRUE);

-- Usuário vê apenas a própria assinatura
CREATE POLICY "usuario_ve_propria_assinatura"
  ON assinaturas
  FOR SELECT
  USING (auth.uid() = usuario_id);

-- Seed: planos iniciais
INSERT INTO planos (nome, tipo, preco_mensal, max_alunos, max_rotinas, features) VALUES
  (
    'Gratuito', 'atleta', 0.00, NULL, 1,
    '["1 rotina ativa", "Sem histórico de treinos", "Biblioteca de exercícios básica"]'
  ),
  (
    'Essencial', 'atleta', 14.90, NULL, 3,
    '["3 rotinas ativas", "90 dias de histórico", "Gráficos básicos de progresso", "Timer de descanso"]'
  ),
  (
    'Premium', 'atleta', 29.90, NULL, NULL,
    '["Rotinas ilimitadas", "Histórico completo", "Todos os gráficos e analytics", "Vídeos dos exercícios", "Records pessoais (PRs)", "Timer de descanso avançado"]'
  ),
  (
    'Inicial', 'personal', 89.90, 10, NULL,
    '["Até 10 alunos ativos", "Dashboard de acompanhamento", "Criação de rotinas para alunos", "Histórico de treinos dos alunos"]'
  ),
  (
    'Profissional', 'personal', 179.90, 30, NULL,
    '["Até 30 alunos ativos", "Dashboard com Realtime", "Gráficos de progresso por aluno", "Construtor de rotinas avançado", "Notificações de treino"]'
  ),
  (
    'Elite', 'personal', 349.90, NULL, NULL,
    '["Alunos ilimitados", "Todos os recursos do Profissional", "Relatórios e exportação de dados", "Suporte prioritário"]'
  )
ON CONFLICT DO NOTHING;
