import { supabase } from "../../lib/supabase";

export type SerieInput = {
  exercicio_id: string;
  numero_serie: number;
  repeticoes: number | null;
  carga_kg: number | null;
  completada: boolean;
};

export async function iniciarSessao(usuarioId: string, rotinaDiaId: string) {
  const { data, error } = await supabase
    .from("treino_sessoes")
    .insert({ usuario_id: usuarioId, rotina_dia_id: rotinaDiaId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function finalizarSessao(
  sessaoId: string,
  series: SerieInput[],
  duracaoSegundos: number,
  observacao?: string
) {
  // Insere todas as séries executadas
  if (series.length > 0) {
    const { error: erroSeries } = await supabase
      .from("treino_series")
      .insert(series.map((s) => ({ ...s, sessao_id: sessaoId })));
    if (erroSeries) throw erroSeries;
  }

  // Marca a sessão como finalizada
  const { data, error } = await supabase
    .from("treino_sessoes")
    .update({
      finalizado_em: new Date().toISOString(),
      duracao_segundos: duracaoSegundos,
      observacao: observacao ?? null,
    })
    .eq("id", sessaoId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listarSessoes(usuarioId: string, limite = 30) {
  const { data, error } = await supabase
    .from("treino_sessoes")
    .select(`
      *,
      rotina_dia:rotina_dias (
        nome,
        ordem,
        rotina:rotinas (nome)
      )
    `)
    .eq("usuario_id", usuarioId)
    .not("finalizado_em", "is", null)
    .order("iniciado_em", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return data;
}

export async function buscarSessaoCompleta(sessaoId: string) {
  const { data, error } = await supabase
    .from("treino_sessoes")
    .select(`
      *,
      rotina_dia:rotina_dias (nome, rotina:rotinas (nome)),
      treino_series (
        *,
        exercicio:exercicios (nome, grupo_muscular)
      )
    `)
    .eq("id", sessaoId)
    .single();
  if (error) throw error;
  return data;
}

export async function listarSessoesNaSemana(usuarioId: string) {
  const inicioSemana = new Date();
  inicioSemana.setHours(0, 0, 0, 0);
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1); // segunda-feira

  const { data, error } = await supabase
    .from("treino_sessoes")
    .select("id, iniciado_em, finalizado_em, rotina_dia_id")
    .eq("usuario_id", usuarioId)
    .not("finalizado_em", "is", null)
    .gte("iniciado_em", inicioSemana.toISOString());
  if (error) throw error;
  return data;
}
