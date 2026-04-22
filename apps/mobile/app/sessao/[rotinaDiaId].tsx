import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { buscarRotinaDia } from "../../src/features/rotinas/rotinasService";
import { useIniciarSessao, useFinalizarSessao } from "../../src/features/sessoes/useSessoes";
import type { SerieInput } from "../../src/features/sessoes/sessoesService";
import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

type SerieEstado = {
  repeticoes: string;
  carga_kg: string;
  completada: boolean;
};

type ExercicioEstado = {
  exercicio_id: string;
  nome: string;
  qtdSeries: number; // nº de séries configuradas na rotina
  series: SerieEstado[];
};

// ─── Rest Timer ───────────────────────────────────────────────────────────────

function useRestTimer(descansoSegundos: number) {
  const [restando, setRestando] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciar = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRestando(descansoSegundos);
    intervalRef.current = setInterval(() => {
      setRestando((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          Vibration.vibrate([0, 300, 100, 300]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [descansoSegundos]);

  const cancelar = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRestando(0);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return { restando, iniciar, cancelar };
}

function formatarTempo(seg: number) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Componente de Série ──────────────────────────────────────────────────────

function SerieCard({
  numero,
  serie,
  onChange,
  onCheck,
  onIniciarTimer,
}: {
  numero: number;
  serie: SerieEstado;
  onChange: (campo: "repeticoes" | "carga_kg", valor: string) => void;
  onCheck: () => void;
  onIniciarTimer: () => void;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${
        serie.completada ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <Text className="w-6 text-center text-gray-400 font-semibold text-sm">
        {numero}
      </Text>

      <View className="flex-row items-center gap-2 flex-1">
        <View className="flex-1">
          <Text className="text-xs text-gray-400 mb-0.5">Peso (kg)</Text>
          <TextInput
            className={`border rounded-lg px-2 py-1.5 text-center text-sm font-semibold ${
              serie.completada
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-900"
            }`}
            value={serie.carga_kg}
            onChangeText={(v) => onChange("carga_kg", v)}
            keyboardType="decimal-pad"
            placeholder="—"
            placeholderTextColor="#9ca3af"
            editable={!serie.completada}
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-400 mb-0.5">Reps</Text>
          <TextInput
            className={`border rounded-lg px-2 py-1.5 text-center text-sm font-semibold ${
              serie.completada
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-900"
            }`}
            value={serie.repeticoes}
            onChangeText={(v) => onChange("repeticoes", v)}
            keyboardType="number-pad"
            placeholder="—"
            placeholderTextColor="#9ca3af"
            editable={!serie.completada}
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-10 h-10 rounded-full items-center justify-center ${
          serie.completada ? "bg-blue-600" : "bg-gray-200"
        }`}
        onPress={() => {
          onCheck();
          if (!serie.completada) onIniciarTimer();
        }}
      >
        <Text className={`text-lg ${serie.completada ? "text-white" : "text-gray-400"}`}>
          ✓
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function SessaoScreen() {
  const { rotinaDiaId } = useLocalSearchParams<{ rotinaDiaId: string }>();

  const { data: rotinaDia, isLoading } = useQuery({
    queryKey: ["rotina-dia", rotinaDiaId],
    queryFn: () => buscarRotinaDia(rotinaDiaId!),
    enabled: !!rotinaDiaId,
  });

  const iniciarSessao = useIniciarSessao();
  const finalizarSessao = useFinalizarSessao();

  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [iniciandoSessao, setIniciandoSessao] = useState(false);
  const [exercicios, setExercicios] = useState<ExercicioEstado[]>([]);
  const [observacao, setObservacao] = useState("");
  const [cronometroSeg, setCronometroSeg] = useState(0);
  const cronometroRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iniciadoEmRef = useRef<Date | null>(null);

  // Descanso padrão: primeiro exercício ou 60s
  const descansoSegundos =
    rotinaDia?.rotina_exercicios[0]?.descanso_segundos ?? 60;
  const { restando, iniciar: iniciarTimer, cancelar: cancelarTimer } =
    useRestTimer(descansoSegundos);

  // Inicia sessão automaticamente ao carregar
  useEffect(() => {
    if (!rotinaDia || sessaoId || iniciandoSessao) return;
    setIniciandoSessao(true);

    // Monta estado inicial dos exercícios
    const estadoInicial: ExercicioEstado[] = rotinaDia.rotina_exercicios.map(
      (re) => ({
        exercicio_id: re.exercicio_id,
        nome: re.exercicio?.nome ?? "Exercício",
        qtdSeries: re.series ?? 3,
        series: Array.from({ length: re.series ?? 3 }, () => ({
          repeticoes: re.repeticoes ?? "",
          carga_kg: re.carga_sugerida ? String(re.carga_sugerida) : "",
          completada: false,
        })),
      })
    );
    setExercicios(estadoInicial);

    iniciarSessao.mutate(
      { rotinaDiaId: rotinaDia.id },
      {
        onSuccess: (sessao) => {
          setSessaoId(sessao.id);
          iniciadoEmRef.current = new Date(sessao.iniciado_em);
          // Inicia cronômetro
          cronometroRef.current = setInterval(
            () => setCronometroSeg((s) => s + 1),
            1000
          );
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível iniciar a sessão.");
          router.back();
        },
        onSettled: () => setIniciandoSessao(false),
      }
    );
  }, [rotinaDia]);

  useEffect(
    () => () => {
      if (cronometroRef.current) clearInterval(cronometroRef.current);
    },
    []
  );

  const atualizarSerie = useCallback(
    (
      exIdx: number,
      serieIdx: number,
      campo: "repeticoes" | "carga_kg",
      valor: string
    ) => {
      setExercicios((prev) =>
        prev.map((ex, ei) =>
          ei !== exIdx
            ? ex
            : {
                ...ex,
                series: ex.series.map((s, si) =>
                  si !== serieIdx ? s : { ...s, [campo]: valor }
                ),
              }
        )
      );
    },
    []
  );

  const toggleSerie = useCallback((exIdx: number, serieIdx: number) => {
    setExercicios((prev) =>
      prev.map((ex, ei) =>
        ei !== exIdx
          ? ex
          : {
              ...ex,
              series: ex.series.map((s, si) =>
                si !== serieIdx ? s : { ...s, completada: !s.completada }
              ),
            }
      )
    );
  }, []);

  const handleFinalizar = useCallback(() => {
    if (!sessaoId) return;

    const series: SerieInput[] = [];
    exercicios.forEach((ex) => {
      ex.series.forEach((s, idx) => {
        series.push({
          exercicio_id: ex.exercicio_id,
          numero_serie: idx + 1,
          repeticoes: s.repeticoes ? parseInt(s.repeticoes) : null,
          carga_kg: s.carga_kg ? parseFloat(s.carga_kg) : null,
          completada: s.completada,
        });
      });
    });

    const totalCompletadas = series.filter((s) => s.completada).length;

    Alert.alert(
      "Finalizar treino",
      `${totalCompletadas} de ${series.length} série${series.length !== 1 ? "s" : ""} completada${totalCompletadas !== 1 ? "s" : ""}. Confirmar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          style: "default",
          onPress: () => {
            if (cronometroRef.current) clearInterval(cronometroRef.current);
            finalizarSessao.mutate(
              {
                sessaoId,
                series,
                duracaoSegundos: cronometroSeg,
                observacao: observacao.trim() || undefined,
              },
              {
                onSuccess: () => {
                  Alert.alert(
                    "Treino concluído! 💪",
                    `Duração: ${formatarTempo(cronometroSeg)}`,
                    [{ text: "Ok", onPress: () => router.replace("/(tabs)/") }]
                  );
                },
                onError: () =>
                  Alert.alert("Erro", "Não foi possível salvar o treino."),
              }
            );
          },
        },
      ]
    );
  }, [sessaoId, exercicios, cronometroSeg, observacao, finalizarSessao]);

  if (isLoading || iniciandoSessao || !sessaoId) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-400 mt-3">Iniciando sessão...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header fixo */}
      <View className="bg-white px-5 pt-14 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Sair do treino",
                "Seu progresso não será salvo.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Sair",
                    style: "destructive",
                    onPress: () => {
                      if (cronometroRef.current) clearInterval(cronometroRef.current);
                      router.back();
                    },
                  },
                ]
              )
            }
          >
            <Text className="text-gray-400 text-sm">✕ Sair</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-bold text-gray-900 text-base">
              {rotinaDia?.nome}
            </Text>
            <Text className="text-blue-600 font-semibold text-sm tabular-nums">
              {formatarTempo(cronometroSeg)}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-xl"
            onPress={handleFinalizar}
            disabled={finalizarSessao.isPending}
          >
            <Text className="text-white font-semibold text-sm">
              {finalizarSessao.isPending ? "..." : "Finalizar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rest timer banner */}
      {restando > 0 && (
        <View className="bg-blue-600 px-5 py-3 flex-row items-center justify-between">
          <Text className="text-white font-semibold">
            Descanso: {formatarTempo(restando)}
          </Text>
          <TouchableOpacity onPress={cancelarTimer}>
            <Text className="text-blue-200 text-sm">Pular</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pt-4 pb-32"
      >
        {exercicios.map((ex, exIdx) => {
          const completadasNoEx = ex.series.filter((s) => s.completada).length;
          return (
            <View key={ex.exercicio_id} className="mb-5">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold text-gray-900 text-base flex-1">
                  {ex.nome}
                </Text>
                <Text className="text-gray-400 text-xs ml-2">
                  {completadasNoEx}/{ex.qtdSeries}
                </Text>
              </View>

              {/* Cabeçalho das colunas */}
              <View className="flex-row gap-3 px-3 mb-1">
                <Text className="w-6" />
                <Text className="flex-1 text-center text-xs text-gray-400">
                  Peso (kg)
                </Text>
                <Text className="flex-1 text-center text-xs text-gray-400">
                  Reps
                </Text>
                <Text className="w-10" />
              </View>

              {ex.series.map((serie, sIdx) => (
                <SerieCard
                  key={sIdx}
                  numero={sIdx + 1}
                  serie={serie}
                  onChange={(campo, valor) =>
                    atualizarSerie(exIdx, sIdx, campo, valor)
                  }
                  onCheck={() => toggleSerie(exIdx, sIdx)}
                  onIniciarTimer={iniciarTimer}
                />
              ))}
            </View>
          );
        })}

        {/* Observação */}
        <View className="mt-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Observação (opcional)
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm"
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Como foi o treino?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
