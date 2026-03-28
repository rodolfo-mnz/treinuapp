export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.4" }
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nome: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
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
          id: string
          nome: string
          objetivo: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          nome: string
          objetivo?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          nome?: string
          objetivo?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = { public: { Enums: {} } } as const

// ─── Helpers de conveniência ───────────────────────────────────────────────────
export type Profile          = Tables<"profiles">
export type Exercicio        = Tables<"exercicios">
export type Rotina           = Tables<"rotinas">
export type RotinaDia        = Tables<"rotina_dias">
export type RotinaExercicio  = Tables<"rotina_exercicios">
export type TipoPerfil       = "atleta" | "personal"

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
