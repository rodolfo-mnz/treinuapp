import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../src/features/auth/authStore";
import { useRotinas, useRotinaCompleta } from "../../src/features/rotinas/useRotinas";
import { useSessoesNaSemana } from "../../src/features/sessoes/useSessoes";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function primeiroNome(nome?: string | null) {
  if (!nome) return "atleta";
  return nome.split(" ")[0] ?? nome;
}

function getInicioSemana() {
  const hoje = new Date();
  const diasDesdeSegunda = (hoje.getDay() + 6) % 7; // 0=Seg ... 6=Dom
  const seg = new Date(hoje);
  seg.setHours(0, 0, 0, 0);
  seg.setDate(hoje.getDate() - diasDesdeSegunda);
  return seg;
}

function getDiasStrip() {
  const seg = getInicioSemana();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(seg);
    d.setDate(seg.getDate() + i);
    return d;
  });
}

function isMesmodia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function HomeScreen() {
  const { session } = useAuthStore();
  const nome = session?.user.user_metadata?.nome as string | undefined;

  const { data: rotinas, isLoading: loadingRotinas } = useRotinas();
  const rotinaAtiva = rotinas?.find((r) => r.ativa) ?? rotinas?.[0] ?? null;

  const { data: rotinaCompleta, isLoading: loadingRotina } = useRotinaCompleta(
    rotinaAtiva?.id ?? ""
  );

  const { data: sessoesNaSemana } = useSessoesNaSemana();

  const hoje = useMemo(() => new Date(), []);
  const diasStrip = useMemo(() => getDiasStrip(), []);

  // IDs dos dias da rotina que já foram treinados esta semana
  const diasTreinados = useMemo(() => {
    if (!sessoesNaSemana) return new Set<string>();
    return new Set(sessoesNaSemana.map((s) => s.rotina_dia_id));
  }, [sessoesNaSemana]);

  // Datas que tiveram treino esta semana
  const datasComTreino = useMemo(() => {
    if (!sessoesNaSemana) return new Set<string>();
    return new Set(
      sessoesNaSemana.map((s) => {
        const d = new Date(s.iniciado_em);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
  }, [sessoesNaSemana]);

  const diaTreinouHoje = useMemo(
    () =>
      datasComTreino.has(
        `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`
      ),
    [datasComTreino, hoje]
  );

  const handleIniciarSessao = useCallback((rotinaDiaId: string) => {
    router.push(`/sessao/${rotinaDiaId}`);
  }, []);

  const isLoading = loadingRotinas || loadingRotina;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">
          Olá, {primeiroNome(nome)} 👋
        </Text>
        <Text className="text-gray-500 mt-1 text-sm">
          {diaTreinouHoje
            ? "Parabéns! Você já treinou hoje."
            : "Bora treinar hoje?"}
        </Text>
      </View>

      {/* Strip semanal */}
      <View className="bg-white mt-3 mx-4 rounded-2xl p-4 shadow-sm">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Semana atual
        </Text>
        <View className="flex-row justify-between">
          {diasStrip.map((dia, i) => {
            const isHoje = isMesmodia(dia, hoje);
            const chave = `${dia.getFullYear()}-${dia.getMonth()}-${dia.getDate()}`;
            const treinouNesseDia = datasComTreino.has(chave);
            return (
              <View key={i} className="items-center gap-1">
                <Text
                  className={`text-xs font-medium ${
                    isHoje ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {DIAS_SEMANA[i]}
                </Text>
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    treinouNesseDia
                      ? "bg-blue-600"
                      : isHoje
                      ? "border-2 border-blue-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      treinouNesseDia
                        ? "text-white"
                        : isHoje
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {dia.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Treino de hoje */}
      <View className="mt-5 px-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          {rotinaCompleta ? rotinaCompleta.nome : "Treino de hoje"}
        </Text>

        {!rotinaCompleta ? (
          <View className="bg-white rounded-2xl p-6 items-center shadow-sm">
            <Text className="text-gray-400 text-center">
              Você ainda não tem uma rotina ativa.{"\n"}Crie uma em Treinos.
            </Text>
            <TouchableOpacity
              className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
              onPress={() => router.push("/(tabs)/treinos")}
            >
              <Text className="text-white font-semibold">Criar rotina</Text>
            </TouchableOpacity>
          </View>
        ) : (
          rotinaCompleta.rotina_dias.map((dia, idx) => {
            const jaTreinou = diasTreinados.has(dia.id);
            const grupos = [
              ...new Set(
                dia.rotina_exercicios
                  .map((re) => re.exercicio?.grupo_muscular)
                  .filter(Boolean)
              ),
            ].slice(0, 3);

            const isProximo =
              !jaTreinou &&
              idx ===
                rotinaCompleta.rotina_dias.findIndex(
                  (d) => !diasTreinados.has(d.id)
                );

            return (
              <View
                key={dia.id}
                className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${
                  isProximo ? "border-blue-200" : "border-transparent"
                }`}
              >
                {isProximo && (
                  <View className="bg-blue-50 rounded-lg px-3 py-1 self-start mb-2">
                    <Text className="text-blue-600 text-xs font-semibold">
                      Sugerido para hoje
                    </Text>
                  </View>
                )}
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base">
                      {dia.nome}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-0.5">
                      {dia.rotina_exercicios.length} exercício
                      {dia.rotina_exercicios.length !== 1 ? "s" : ""}
                    </Text>
                    {grupos.length > 0 && (
                      <View className="flex-row flex-wrap gap-1 mt-2">
                        {grupos.map((g) => (
                          <View
                            key={g}
                            className="bg-gray-100 rounded-full px-2 py-0.5"
                          >
                            <Text className="text-gray-500 text-xs">{g}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    className={`ml-3 px-4 py-2 rounded-xl ${
                      jaTreinou ? "bg-gray-100" : "bg-blue-600"
                    }`}
                    onPress={() =>
                      !jaTreinou && handleIniciarSessao(dia.id)
                    }
                    disabled={jaTreinou}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        jaTreinou ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {jaTreinou ? "Feito ✓" : "Iniciar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Atalho histórico */}
      {sessoesNaSemana && sessoesNaSemana.length > 0 && (
        <TouchableOpacity
          className="mx-4 mt-2 bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
          onPress={() => router.push("/(tabs)/historico")}
        >
          <View>
            <Text className="font-semibold text-gray-900">
              {sessoesNaSemana.length} treino
              {sessoesNaSemana.length !== 1 ? "s" : ""} esta semana
            </Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              Ver histórico completo →
            </Text>
          </View>
          <Text className="text-2xl">📈</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
