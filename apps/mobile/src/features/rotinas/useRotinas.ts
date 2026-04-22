import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarRotinas,
  buscarRotinaCompleta,
  criarRotina,
  atualizarRotina,
  ativarRotina,
  deletarRotina,
  criarRotinaDia,
  atualizarRotinaDia,
  deletarRotinaDia,
  adicionarExercicioAoDia,
  atualizarRotinaExercicio,
  removerExercicioDoDia,
} from "./rotinasService";
import { useAuthStore } from "../auth/authStore";

const KEYS = {
  lista: (uid: string) => ["rotinas", uid] as const,
  detalhe: (id: string) => ["rotina", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useRotinas() {
  const { session } = useAuthStore();
  const uid = session?.user.id ?? "";
  return useQuery({
    queryKey: KEYS.lista(uid),
    queryFn: () => listarRotinas(uid),
    enabled: !!uid,
  });
}

export function useRotinaCompleta(id: string) {
  return useQuery({
    queryKey: KEYS.detalhe(id),
    queryFn: () => buscarRotinaCompleta(id),
    enabled: !!id,
  });
}

// ─── Mutações: Rotina ─────────────────────────────────────────────────────────

export function useCriarRotina() {
  const qc = useQueryClient();
  const { session } = useAuthStore();
  return useMutation({
    mutationFn: criarRotina,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.lista(session?.user.id ?? "") }),
  });
}

export function useAtualizarRotina(id: string) {
  const qc = useQueryClient();
  const { session } = useAuthStore();
  return useMutation({
    mutationFn: (dados: Parameters<typeof atualizarRotina>[1]) =>
      atualizarRotina(id, dados),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.lista(session?.user.id ?? "") });
      qc.invalidateQueries({ queryKey: KEYS.detalhe(id) });
    },
  });
}

export function useAtivarRotina() {
  const qc = useQueryClient();
  const { session } = useAuthStore();
  return useMutation({
    mutationFn: (id: string) => ativarRotina(id, session!.user.id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.lista(session?.user.id ?? "") }),
  });
}

export function useDeletarRotina() {
  const qc = useQueryClient();
  const { session } = useAuthStore();
  return useMutation({
    mutationFn: deletarRotina,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.lista(session?.user.id ?? "") }),
  });
}

// ─── Mutações: Dias ───────────────────────────────────────────────────────────

export function useCriarRotinaDia(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: criarRotinaDia,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}

export function useAtualizarRotinaDia(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Parameters<typeof atualizarRotinaDia>[1] }) =>
      atualizarRotinaDia(id, dados),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}

export function useDeletarRotinaDia(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletarRotinaDia,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}

// ─── Mutações: Exercícios do Dia ──────────────────────────────────────────────

export function useAdicionarExercicioAoDia(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adicionarExercicioAoDia,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}

export function useAtualizarRotinaExercicio(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Parameters<typeof atualizarRotinaExercicio>[1] }) =>
      atualizarRotinaExercicio(id, dados),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}

export function useRemoverExercicioDoDia(rotinaId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removerExercicioDoDia,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detalhe(rotinaId) }),
  });
}
