// ─── Tipos auto-gerados pelo Supabase ─────────────────────────────────────────
// Este arquivo é a fonte de verdade dos tipos de banco para mobile e web.
// Para regenerar: npx supabase gen types typescript --project-id <id> > packages/database/index.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercicios: {
        Row: {
          created_at: string
          criado_por: string | null
          equipamento: string
          grupo_muscular: string
          id: string
          instrucoes: string | null
          nome: string
          publico: boolean
          thumbnail_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          equipamento?: string
          grupo_muscular: string
          id?: string
          instrucoes?: string | null
          nome: string
          publico?: boolean
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          equipamento?: string
          grupo_muscular?: string
          id?: string
          instrucoes?: string | null
          nome?: string
          publico?: boolean
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          id: string
          nome: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      rotina_dias: {
        Row: {
          created_at: string
          id: string
          nome: string
          ordem: number
          rotina_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          ordem?: number
          rotina_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
          rotina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rotina_dias_rotina_id_fkey"
            columns: ["rotina_id"]
            isOneToOne: false
            referencedRelation: "rotinas"
            referencedColumns: ["id"]
          },
        ]
      }
      rotina_exercicios: {
        Row: {
          carga_sugerida: number | null
          created_at: string
          descanso_segundos: number
          exercicio_id: string
          id: string
          observacao: string | null
          ordem: number
          repeticoes: string
          rotina_dia_id: string
          series: number
          updated_at: string
        }
        Insert: {
          carga_sugerida?: number | null
          created_at?: string
          descanso_segundos?: number
          exercicio_id: string
          id?: string
          observacao?: string | null
          ordem?: number
          repeticoes?: string
          rotina_dia_id: string
          series?: number
          updated_at?: string
        }
        Update: {
          carga_sugerida?: number | null
          created_at?: string
          descanso_segundos?: number
          exercicio_id?: string
          id?: string
          observacao?: string | null
          ordem?: number
          repeticoes?: string
          rotina_dia_id?: string
          series?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rotina_exercicios_exercicio_id_fkey"
            columns: ["exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rotina_exercicios_rotina_dia_id_fkey"
            columns: ["rotina_dia_id"]
            isOneToOne: false
            referencedRelation: "rotina_dias"
            referencedColumns: ["id"]
          },
        ]
      }
      rotinas: {
        Row: {
          ativa: boolean
          created_at: string
          criado_por_treinador_id: string | null
          id: string
          nome: string
          objetivo: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          criado_por_treinador_id?: string | null
          id?: string
          nome: string
          objetivo?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          criado_por_treinador_id?: string | null
          id?: string
          nome?: string
          objetivo?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
      treino_sessoes: {
        Row: {
          created_at: string
          duracao_segundos: number | null
          finalizado_em: string | null
          id: string
          iniciado_em: string
          observacao: string | null
          rotina_dia_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          duracao_segundos?: number | null
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          observacao?: string | null
          rotina_dia_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          duracao_segundos?: number | null
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          observacao?: string | null
          rotina_dia_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treino_sessoes_rotina_dia_id_fkey"
            columns: ["rotina_dia_id"]
            isOneToOne: false
            referencedRelation: "rotina_dias"
            referencedColumns: ["id"]
          },
        ]
      }
      treino_series: {
        Row: {
          carga_kg: number | null
          completada: boolean
          created_at: string
          exercicio_id: string
          id: string
          numero_serie: number
          repeticoes: number | null
          sessao_id: string
        }
        Insert: {
          carga_kg?: number | null
          completada?: boolean
          created_at?: string
          exercicio_id: string
          id?: string
          numero_serie: number
          repeticoes?: number | null
          sessao_id: string
        }
        Update: {
          carga_kg?: number | null
          completada?: boolean
          created_at?: string
          exercicio_id?: string
          id?: string
          numero_serie?: number
          repeticoes?: number | null
          sessao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treino_series_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "treino_sessoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treino_series_exercicio_id_fkey"
            columns: ["exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
        ]
      }
      treinador_alunos: {
        Row: {
          aluno_id: string
          created_at: string
          id: string
          status: string
          treinador_id: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          id?: string
          status?: string
          treinador_id: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          id?: string
          status?: string
          treinador_id?: string
        }
        Relationships: []
      }
      convites: {
        Row: {
          created_at: string
          email_aluno: string
          expires_at: string
          id: string
          status: string
          token: string
          treinador_id: string
        }
        Insert: {
          created_at?: string
          email_aluno: string
          expires_at: string
          id?: string
          status?: string
          token: string
          treinador_id: string
        }
        Update: {
          created_at?: string
          email_aluno?: string
          expires_at?: string
          id?: string
          status?: string
          token?: string
          treinador_id?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          ativo: boolean
          created_at: string
          features: Json | null
          id: string
          max_alunos: number | null
          max_rotinas: number | null
          nome: string
          preco_mensal: number
          tipo: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          features?: Json | null
          id?: string
          max_alunos?: number | null
          max_rotinas?: number | null
          nome: string
          preco_mensal: number
          tipo: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          features?: Json | null
          id?: string
          max_alunos?: number | null
          max_rotinas?: number | null
          nome?: string
          preco_mensal?: number
          tipo?: string
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          created_at: string
          gateway: string | null
          gateway_subscription_id: string | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string
          plano_id: string
          status: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          gateway?: string | null
          gateway_subscription_id?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio: string
          plano_id: string
          status?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          gateway?: string | null
          gateway_subscription_id?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string
          plano_id?: string
          status?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = { public: { Enums: {} } } as const

// ─── Helpers de conveniência ───────────────────────────────────────────────────
export type Profile           = Tables<"profiles">
export type Exercicio         = Tables<"exercicios">
export type Rotina            = Tables<"rotinas">
export type RotinaDia         = Tables<"rotina_dias">
export type RotinaExercicio   = Tables<"rotina_exercicios">
export type TreinoSessao      = Tables<"treino_sessoes">
export type TreinoSerie       = Tables<"treino_series">
export type TreinadorAluno    = Tables<"treinador_alunos">
export type Convite           = Tables<"convites">
export type Plano             = Tables<"planos">
export type Assinatura        = Tables<"assinaturas">
export type TipoPerfil        = "atleta" | "personal"
export type StatusAssinatura  = "ativo" | "cancelado" | "expirado" | "trial"
export type StatusConvite     = "pendente" | "aceito" | "expirado"
export type StatusAluno       = "ativo" | "pausado" | "encerrado"

// Tipos compostos para queries nested
export type RotinaExercicioComExercicio = RotinaExercicio & {
  exercicio: Exercicio
}

export type RotinaDiaComExercicios = RotinaDia & {
  rotina_exercicios: RotinaExercicioComExercicio[]
}

export type RotinaCompleta = Rotina & {
  rotina_dias: RotinaDiaComExercicios[]
}

export type TreinoSerieComExercicio = TreinoSerie & {
  exercicio: Exercicio
}

export type TreinoSessaoCompleta = TreinoSessao & {
  rotina_dia: RotinaDia & { rotina: Rotina }
  treino_series: TreinoSerieComExercicio[]
}

export type AlunoComProgresso = Profile & {
  ultima_sessao?: TreinoSessao | null
  total_sessoes?: number
  rotina_ativa?: Rotina | null
  status_relacao: StatusAluno
}
