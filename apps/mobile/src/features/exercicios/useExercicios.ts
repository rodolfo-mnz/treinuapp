import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarExercicios,
  criarExercicio,
  atualizarExercicio,
  deletarExercicio,
  type FiltrosExercicios,
} from "./exerciciosService";
import type { Exercicio } from "../../types/database.types";

const QUERY_KEY = "exercicios";

export function useExercicios(filtros: FiltrosExercicios = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, filtros],
    queryFn: () => listarExercicios(filtros),
  });
}

export function useCriarExercicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarExercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useAtualizarExercicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<Exercicio> }) =>
      atualizarExercicio(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeletarExercicio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletarExercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
