import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import {
  listarSessoes,
  listarSessoesNaSemana,
  buscarSessaoCompleta,
  iniciarSessao,
  finalizarSessao,
  type SerieInput,
} from "./sessoesService";

export function useSessoes() {
  const session = useAuthStore((s) => s.session);
  return useQuery({
    queryKey: ["sessoes", session?.user.id],
    queryFn: () => listarSessoes(session!.user.id),
    enabled: !!session,
  });
}

export function useSessoesNaSemana() {
  const session = useAuthStore((s) => s.session);
  return useQuery({
    queryKey: ["sessoes-semana", session?.user.id],
    queryFn: () => listarSessoesNaSemana(session!.user.id),
    enabled: !!session,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useSessaoCompleta(sessaoId: string | null) {
  return useQuery({
    queryKey: ["sessao", sessaoId],
    queryFn: () => buscarSessaoCompleta(sessaoId!),
    enabled: !!sessaoId,
  });
}

export function useIniciarSessao() {
  const session = useAuthStore((s) => s.session);
  return useMutation({
    mutationFn: ({ rotinaDiaId }: { rotinaDiaId: string }) =>
      iniciarSessao(session!.user.id, rotinaDiaId),
  });
}

export function useFinalizarSessao() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);

  return useMutation({
    mutationFn: ({
      sessaoId,
      series,
      duracaoSegundos,
      observacao,
    }: {
      sessaoId: string;
      series: SerieInput[];
      duracaoSegundos: number;
      observacao?: string;
    }) => finalizarSessao(sessaoId, series, duracaoSegundos, observacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessoes", session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ["sessoes-semana", session?.user.id] });
    },
  });
}
