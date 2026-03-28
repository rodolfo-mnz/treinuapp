import { supabase } from "../../lib/supabase";
import type {
  Rotina,
  RotinaDia,
  RotinaExercicio,
  RotinaCompleta,
} from "../../types/database.types";

// ─── Rotinas ──────────────────────────────────────────────────────────────────

export async function listarRotinas(usuarioId: string): Promise<Rotina[]> {
  const { data, error } = await supabase
    .from("rotinas")
    .select("*")
    .eq("usuario_id", usuarioId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function buscarRotinaCompleta(id: string): Promise<RotinaCompleta> {
  const { data, error } = await supabase
    .from("rotinas")
    .select(`
      *,
      rotina_dias (
        *,
        rotina_exercicios (
          *,
          exercicio:exercicios (*)
        )
      )
    `)
    .eq("id", id)
    .single();
  if (error) throw error;

  // Ordenar dias e exercícios por ordem
  const rotina = data as RotinaCompleta;
  rotina.rotina_dias.sort((a, b) => a.ordem - b.ordem);
  rotina.rotina_dias.forEach((dia) =>
    dia.rotina_exercicios.sort((a, b) => a.ordem - b.ordem)
  );
  return rotina;
}

export async function criarRotina(
  dados: Pick<Rotina, "usuario_id" | "nome"> & { objetivo?: string }
): Promise<Rotina> {
  const { data, error } = await supabase
    .from("rotinas")
    .insert(dados)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarRotina(
  id: string,
  dados: Partial<Pick<Rotina, "nome" | "objetivo" | "ativa">>
): Promise<Rotina> {
  const { data, error } = await supabase
    .from("rotinas")
    .update(dados)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function ativarRotina(
  id: string,
  usuarioId: string
): Promise<void> {
  // Desativa todas, depois ativa a escolhida
  const { error: e1 } = await supabase
    .from("rotinas")
    .update({ ativa: false })
    .eq("usuario_id", usuarioId);
  if (e1) throw e1;

  const { error: e2 } = await supabase
    .from("rotinas")
    .update({ ativa: true })
    .eq("id", id);
  if (e2) throw e2;
}

export async function deletarRotina(id: string): Promise<void> {
  const { error } = await supabase.from("rotinas").delete().eq("id", id);
  if (error) throw error;
}

// ─── Rotina Dias ─────────────────────────────────────────────────────────────

export async function criarRotinaDia(
  dados: Pick<RotinaDia, "rotina_id" | "nome" | "ordem">
): Promise<RotinaDia> {
  const { data, error } = await supabase
    .from("rotina_dias")
    .insert(dados)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarRotinaDia(
  id: string,
  dados: Partial<Pick<RotinaDia, "nome" | "ordem">>
): Promise<RotinaDia> {
  const { data, error } = await supabase
    .from("rotina_dias")
    .update(dados)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarRotinaDia(id: string): Promise<void> {
  const { error } = await supabase.from("rotina_dias").delete().eq("id", id);
  if (error) throw error;
}

// ─── Rotina Exercícios ────────────────────────────────────────────────────────

export async function adicionarExercicioAoDia(
  dados: Pick<RotinaExercicio, "rotina_dia_id" | "exercicio_id" | "ordem"> & {
    series?: number;
    repeticoes?: string;
    carga_sugerida?: number;
    descanso_segundos?: number;
    observacao?: string;
  }
): Promise<RotinaExercicio> {
  const { data, error } = await supabase
    .from("rotina_exercicios")
    .insert(dados)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarRotinaExercicio(
  id: string,
  dados: Partial<
    Pick<
      RotinaExercicio,
      "series" | "repeticoes" | "carga_sugerida" | "descanso_segundos" | "observacao" | "ordem"
    >
  >
): Promise<RotinaExercicio> {
  const { data, error } = await supabase
    .from("rotina_exercicios")
    .update(dados)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removerExercicioDoDia(id: string): Promise<void> {
  const { error } = await supabase
    .from("rotina_exercicios")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
