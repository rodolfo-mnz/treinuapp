import { supabase } from "../../lib/supabase";
import type { Exercicio } from "../../types/database.types";

export interface FiltrosExercicios {
  busca?: string;
  grupoMuscular?: string;
}

export async function listarExercicios(
  filtros: FiltrosExercicios = {}
): Promise<Exercicio[]> {
  let query = supabase
    .from("exercicios")
    .select("*")
    .order("nome", { ascending: true });

  if (filtros.grupoMuscular) {
    query = query.eq("grupo_muscular", filtros.grupoMuscular);
  }

  if (filtros.busca?.trim()) {
    query = query.ilike("nome", `%${filtros.busca.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function criarExercicio(
  dados: Pick<Exercicio, "nome" | "grupo_muscular" | "equipamento"> & {
    instrucoes?: string;
    publico?: boolean;
    criado_por: string;
  }
): Promise<Exercicio> {
  const { data, error } = await supabase
    .from("exercicios")
    .insert(dados)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarExercicio(
  id: string,
  dados: Partial<Pick<Exercicio, "nome" | "grupo_muscular" | "equipamento" | "instrucoes" | "publico">>
): Promise<Exercicio> {
  const { data, error } = await supabase
    .from("exercicios")
    .update(dados)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarExercicio(id: string): Promise<void> {
  const { error } = await supabase.from("exercicios").delete().eq("id", id);
  if (error) throw error;
}
