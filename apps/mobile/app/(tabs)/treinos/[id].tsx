import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, Modal, KeyboardAvoidingView, Platform,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  useRotinaCompleta,
  useCriarRotinaDia,
  useDeletarRotinaDia,
  useRemoverExercicioDoDia,
  useAtualizarRotina,
} from "../../../src/features/rotinas/useRotinas";
import type { RotinaDiaComExercicios, RotinaExercicioComExercicio } from "../../../src/types/database.types";

export default function RotinaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: rotina, isLoading } = useRotinaCompleta(id);
  const criarDia        = useCriarRotinaDia(id);
  const deletarDia      = useDeletarRotinaDia(id);
  const removerExercicio = useRemoverExercicioDoDia(id);
  const atualizarRotina = useAtualizarRotina(id);

  const [diasExpandidos, setDiasExpandidos] = useState<Set<string>>(new Set());
  const [modalNovoDia, setModalNovoDia] = useState(false);
  const [nomeDia, setNomeDia] = useState("");
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeRotina, setNomeRotina] = useState("");

  function toggleDia(diaId: string) {
    setDiasExpandidos((prev) => {
      const next = new Set(prev);
      next.has(diaId) ? next.delete(diaId) : next.add(diaId);
      return next;
    });
  }

  async function handleCriarDia() {
    if (!nomeDia.trim()) return;
    await criarDia.mutateAsync({
      rotina_id: id,
      nome: nomeDia.trim(),
      ordem: rotina?.rotina_dias.length ?? 0,
    });
    setNomeDia("");
    setModalNovoDia(false);
  }

  function confirmarDeleteDia(dia: RotinaDiaComExercicios) {
    Alert.alert(
      "Excluir dia",
      `Excluir "${dia.nome}"? Os exercícios deste dia serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletarDia.mutate(dia.id),
        },
      ]
    );
  }

  function confirmarRemoverExercicio(re: RotinaExercicioComExercicio) {
    Alert.alert(
      "Remover exercício",
      `Remover "${re.exercicio.nome}" deste dia?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removerExercicio.mutate(re.id),
        },
      ]
    );
  }

  async function handleSalvarNome() {
    if (!nomeRotina.trim()) return;
    await atualizarRotina.mutateAsync({ nome: nomeRotina.trim() });
    setEditandoNome(false);
  }

  if (isLoading || !rotina) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen options={{ title: "Rotina" }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: rotina.nome }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header da rotina */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-gray-100 shadow-sm">
          {editandoNome ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 border border-blue-400 rounded-xl px-3 py-2 text-base text-gray-900"
                value={nomeRotina}
                onChangeText={setNomeRotina}
                autoFocus
              />
              <TouchableOpacity
                className="px-3 py-2 bg-blue-600 rounded-xl"
                onPress={handleSalvarNome}
              >
                <Text className="text-white font-medium text-sm">Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditandoNome(false)}>
                <Text className="text-gray-400 text-sm">Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => { setNomeRotina(rotina.nome); setEditandoNome(true); }}
              className="flex-row items-center justify-between"
            >
              <View>
                <Text className="text-lg font-bold text-gray-900">{rotina.nome}</Text>
                {rotina.objetivo ? (
                  <Text className="text-sm text-gray-500">{rotina.objetivo}</Text>
                ) : null}
              </View>
              <Text className="text-blue-500 text-sm">Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dias */}
        <View className="mt-4 px-4 gap-3">
          {rotina.rotina_dias.length === 0 && (
            <View className="items-center py-10">
              <Text className="text-gray-400 text-base">Nenhum dia adicionado.</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Toque em "+" para adicionar o primeiro dia.
              </Text>
            </View>
          )}

          {rotina.rotina_dias.map((dia) => {
            const expandido = diasExpandidos.has(dia.id);
            return (
              <View
                key={dia.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Cabeçalho do dia */}
                <TouchableOpacity
                  className="flex-row items-center justify-between px-4 py-3"
                  onPress={() => toggleDia(dia.id)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-2 flex-1">
                    <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                      {dia.nome}
                    </Text>
                    <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                      <Text className="text-xs text-gray-500">
                        {dia.rotina_exercicios.length} exerc.
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => confirmarDeleteDia(dia)}>
                      <Text className="text-red-400 text-sm">Excluir</Text>
                    </TouchableOpacity>
                    <Text className="text-gray-400 text-lg">{expandido ? "▲" : "▼"}</Text>
                  </View>
                </TouchableOpacity>

                {/* Exercícios do dia */}
                {expandido && (
                  <View className="border-t border-gray-100">
                    {dia.rotina_exercicios.map((re, idx) => (
                      <View
                        key={re.id}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          idx < dia.rotina_exercicios.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        <View className="flex-1 mr-3">
                          <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
                            {re.exercicio.nome}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-0.5">
                            {re.series}x{re.repeticoes}
                            {re.carga_sugerida ? ` · ${re.carga_sugerida}kg` : ""}
                            {` · ${re.descanso_segundos}s`}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmarRemoverExercicio(re)}>
                          <Text className="text-red-400 text-xs">Remover</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* Botão adicionar exercício */}
                    <TouchableOpacity
                      className="flex-row items-center gap-2 px-4 py-3 bg-blue-50"
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/treinos/adicionar-exercicio",
                          params: { rotinaId: id, diaId: dia.id, ordemAtual: dia.rotina_exercicios.length },
                        })
                      }
                    >
                      <Text className="text-blue-600 font-medium text-sm">
                        + Adicionar exercício
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FAB: Novo dia */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => setModalNovoDia(true)}
        activeOpacity={0.85}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>

      {/* Modal: Novo dia */}
      <Modal visible={modalNovoDia} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="bg-white rounded-t-3xl p-6 shadow-xl">
            <Text className="text-lg font-bold text-gray-900 mb-4">Novo dia de treino</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50 mb-4"
              placeholder="Ex: Treino A – Peito e Tríceps"
              placeholderTextColor="#9ca3af"
              value={nomeDia}
              onChangeText={setNomeDia}
              autoFocus
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 bg-gray-100 rounded-xl items-center"
                onPress={() => { setModalNovoDia(false); setNomeDia(""); }}
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${
                  criarDia.isPending ? "bg-blue-400" : "bg-blue-600"
                }`}
                onPress={handleCriarDia}
                disabled={criarDia.isPending}
              >
                {criarDia.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Adicionar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
