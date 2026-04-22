import { useState, useMemo } from "react";
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, Modal, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useExercicios } from "../../../src/features/exercicios/useExercicios";
import { useAdicionarExercicioAoDia } from "../../../src/features/rotinas/useRotinas";
import { GRUPOS_MUSCULARES, GRUPO_CORES } from "../../../src/features/exercicios/exerciciosConstants";
import type { Exercicio } from "../../../src/types/database.types";

export default function AdicionarExercicioScreen() {
  const { rotinaId, diaId, ordemAtual } = useLocalSearchParams<{
    rotinaId: string;
    diaId: string;
    ordemAtual: string;
  }>();

  const [busca, setBusca] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);
  const [exercicioSelecionado, setExercicioSelecionado] = useState<Exercicio | null>(null);

  // Config do exercício selecionado
  const [series, setSeries] = useState("3");
  const [repeticoes, setRepeticoes] = useState("8-12");
  const [carga, setCarga] = useState("");
  const [descanso, setDescanso] = useState("60");
  const [modalConfig, setModalConfig] = useState(false);

  const filtros = useMemo(
    () => ({ busca, grupoMuscular: grupoSelecionado ?? undefined }),
    [busca, grupoSelecionado]
  );

  const { data: exercicios, isLoading } = useExercicios(filtros);
  const adicionar = useAdicionarExercicioAoDia(rotinaId);

  function selecionarExercicio(exercicio: Exercicio) {
    setExercicioSelecionado(exercicio);
    setModalConfig(true);
  }

  async function handleAdicionar() {
    if (!exercicioSelecionado) return;
    try {
      await adicionar.mutateAsync({
        rotina_dia_id: diaId,
        exercicio_id: exercicioSelecionado.id,
        ordem: parseInt(ordemAtual ?? "0"),
        series: parseInt(series) || 3,
        repeticoes: repeticoes.trim() || "8-12",
        carga_sugerida: carga ? parseFloat(carga) : undefined,
        descanso_segundos: parseInt(descanso) || 60,
      });
      setModalConfig(false);
      router.back();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao adicionar.";
      Alert.alert("Erro", msg);
    }
  }

  function renderItem({ item }: { item: Exercicio }) {
    const corClasse = GRUPO_CORES[item.grupo_muscular] ?? "bg-gray-100 text-gray-700";
    return (
      <TouchableOpacity
        className="bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center justify-between"
        onPress={() => selecionarExercicio(item)}
        activeOpacity={0.7}
      >
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
            {item.nome}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">{item.equipamento}</Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full ${corClasse.split(" ")[0]}`}>
          <Text className={`text-xs font-medium ${corClasse.split(" ")[1]}`}>
            {item.grupo_muscular}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Adicionar Exercício" }} />

      {/* Busca */}
      <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-100">
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-900"
          placeholder="Buscar exercício..."
          placeholderTextColor="#9ca3af"
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-100"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
      >
        <TouchableOpacity
          className={`px-3 py-1.5 rounded-full border ${
            grupoSelecionado === null ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
          }`}
          onPress={() => setGrupoSelecionado(null)}
        >
          <Text className={`text-sm font-medium ${grupoSelecionado === null ? "text-white" : "text-gray-600"}`}>
            Todos
          </Text>
        </TouchableOpacity>
        {GRUPOS_MUSCULARES.map((grupo) => (
          <TouchableOpacity
            key={grupo}
            className={`px-3 py-1.5 rounded-full border ${
              grupoSelecionado === grupo ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
            }`}
            onPress={() => setGrupoSelecionado((p) => (p === grupo ? null : grupo))}
          >
            <Text className={`text-sm font-medium ${grupoSelecionado === grupo ? "text-white" : "text-gray-600"}`}>
              {grupo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={exercicios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-gray-400">Nenhum exercício encontrado.</Text>
            </View>
          }
        />
      )}

      {/* Modal de configuração */}
      <Modal visible={modalConfig} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="bg-white rounded-t-3xl p-6 shadow-xl">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              {exercicioSelecionado?.nome}
            </Text>
            <Text className="text-sm text-gray-500 mb-5">
              Configure séries, repetições e carga
            </Text>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-1">Séries</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-base text-gray-900 bg-gray-50 text-center"
                  value={series}
                  onChangeText={setSeries}
                  keyboardType="number-pad"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-1">Repetições</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-base text-gray-900 bg-gray-50 text-center"
                  value={repeticoes}
                  onChangeText={setRepeticoes}
                  placeholder="8-12"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-1">Carga (kg)</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-base text-gray-900 bg-gray-50 text-center"
                  value={carga}
                  onChangeText={setCarga}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-xs font-medium text-gray-600 mb-1">
                Descanso (segundos)
              </Text>
              <View className="flex-row gap-2">
                {["30", "45", "60", "90", "120"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    className={`flex-1 py-2 rounded-xl border items-center ${
                      descanso === s ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                    }`}
                    onPress={() => setDescanso(s)}
                  >
                    <Text className={`text-sm font-medium ${descanso === s ? "text-white" : "text-gray-600"}`}>
                      {s}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 bg-gray-100 rounded-xl items-center"
                onPress={() => setModalConfig(false)}
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${
                  adicionar.isPending ? "bg-blue-400" : "bg-blue-600"
                }`}
                onPress={handleAdicionar}
                disabled={adicionar.isPending}
              >
                {adicionar.isPending ? (
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
