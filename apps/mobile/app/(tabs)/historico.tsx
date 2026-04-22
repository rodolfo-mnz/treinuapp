import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSessoes, useSessaoCompleta } from "../../src/features/sessoes/useSessoes";

function formatarDuracao(seg: number | null) {
  if (!seg) return "—";
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m > 0 ? `${m}min ${s}s` : `${s}s`;
}

function formatarData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatarHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function DetalhesSessao({ sessaoId }: { sessaoId: string }) {
  const { data, isLoading } = useSessaoCompleta(sessaoId);

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }

  if (!data) return null;

  // Agrupa séries por exercício
  const porExercicio = new Map<
    string,
    { nome: string; grupo: string | null; series: typeof data.treino_series }
  >();
  for (const serie of data.treino_series) {
    const id = serie.exercicio_id;
    if (!porExercicio.has(id)) {
      porExercicio.set(id, {
        nome: serie.exercicio?.nome ?? "Exercício",
        grupo: serie.exercicio?.grupo_muscular ?? null,
        series: [],
      });
    }
    porExercicio.get(id)!.series.push(serie);
  }

  return (
    <View className="mt-3 pt-3 border-t border-gray-100">
      {[...porExercicio.values()].map((ex, i) => (
        <View key={i} className="mb-3">
          <View className="flex-row items-center gap-2 mb-1.5">
            <Text className="font-semibold text-gray-800 text-sm">
              {ex.nome}
            </Text>
            {ex.grupo && (
              <View className="bg-gray-100 rounded-full px-2 py-0.5">
                <Text className="text-gray-500 text-xs">{ex.grupo}</Text>
              </View>
            )}
          </View>
          <View className="flex-row flex-wrap gap-1.5">
            {ex.series.map((s, si) => (
              <View
                key={si}
                className={`rounded-lg px-3 py-1.5 ${
                  s.completada ? "bg-blue-50 border border-blue-100" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    s.completada ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {s.carga_kg != null ? `${s.carga_kg}kg` : "—"} ×{" "}
                  {s.repeticoes ?? "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      {data.observacao && (
        <View className="bg-yellow-50 rounded-xl p-3 mt-1">
          <Text className="text-yellow-700 text-xs">{data.observacao}</Text>
        </View>
      )}
    </View>
  );
}

export default function HistoricoScreen() {
  const { data: sessoes, isLoading } = useSessoes();
  const [expandido, setExpandido] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const semSessoes = !sessoes || sessoes.length === 0;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Histórico</Text>
        {!semSessoes && (
          <Text className="text-gray-400 text-sm mt-1">
            {sessoes.length} treino{sessoes.length !== 1 ? "s" : ""} registrado
            {sessoes.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {semSessoes ? (
        <View className="flex-1 items-center justify-center mt-20 px-8">
          <Text className="text-4xl mb-3">🏋️</Text>
          <Text className="text-gray-500 text-center">
            Seus treinos finalizados aparecerão aqui.
          </Text>
        </View>
      ) : (
        <View className="px-4 pt-4">
          {sessoes.map((s) => {
            const isAberto = expandido === s.id;
            const rotinaNome =
              (s.rotina_dia as any)?.rotina?.nome ?? "Treino";
            const diaNome = (s.rotina_dia as any)?.nome ?? "";

            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.8}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                onPress={() => setExpandido(isAberto ? null : s.id)}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base">
                      {diaNome || rotinaNome}
                    </Text>
                    {diaNome ? (
                      <Text className="text-gray-400 text-xs mt-0.5">
                        {rotinaNome}
                      </Text>
                    ) : null}
                    <View className="flex-row gap-3 mt-2">
                      <Text className="text-gray-500 text-xs">
                        📅 {formatarData(s.iniciado_em)}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        🕐 {formatarHora(s.iniciado_em)}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        ⏱ {formatarDuracao(s.duracao_segundos)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-300 ml-2 mt-1">
                    {isAberto ? "▲" : "▼"}
                  </Text>
                </View>

                {isAberto && <DetalhesSessao sessaoId={s.id} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
