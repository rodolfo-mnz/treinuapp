import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { router, Stack } from "expo-router";
import { useExercicios, useDeletarExercicio } from "../../../src/features/exercicios/useExercicios";
import { GRUPOS_MUSCULARES, GRUPO_CORES } from "../../../src/features/exercicios/exerciciosConstants";
import type { Exercicio } from "../../../src/types/database.types";
import { useAuthStore } from "../../../src/features/auth/authStore";

export default function ExerciciosScreen() {
  const [busca, setBusca] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);

  const filtros = useMemo(
    () => ({ busca, grupoMuscular: grupoSelecionado ?? undefined }),
    [busca, grupoSelecionado]
  );

  const { data: exercicios, isLoading, isError, refetch } = useExercicios(filtros);
  const deletar = useDeletarExercicio();
  const { session } = useAuthStore();

  function confirmarDelete(exercicio: Exercicio) {
    Alert.alert(
      "Excluir exercício",
      `Deseja excluir "${exercicio.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletar.mutate(exercicio.id),
        },
      ]
    );
  }

  function renderItem({ item }: { item: Exercicio }) {
    const corClasse = GRUPO_CORES[item.grupo_muscular] ?? "bg-gray-100 text-gray-700";
    const ehDono = item.criado_por === session?.user.id;

    return (
      <TouchableOpacity
        className="bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/exercicios/[id]",
            params: { id: item.id },
          })
        }
        activeOpacity={0.7}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
              {item.nome}
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">{item.equipamento}</Text>
          </View>

          <View className="items-end gap-1">
            <View className={`px-2 py-0.5 rounded-full ${corClasse.split(" ")[0]}`}>
              <Text className={`text-xs font-medium ${corClasse.split(" ")[1]}`}>
                {item.grupo_muscular}
              </Text>
            </View>
            {ehDono && (
              <TouchableOpacity onPress={() => confirmarDelete(item)}>
                <Text className="text-xs text-red-400">Excluir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Exercícios" }} />
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

      {/* Filtros por grupo muscular */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-100"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
      >
        <TouchableOpacity
          className={`px-3 py-1.5 rounded-full border ${
            grupoSelecionado === null
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-gray-300"
          }`}
          onPress={() => setGrupoSelecionado(null)}
        >
          <Text
            className={`text-sm font-medium ${
              grupoSelecionado === null ? "text-white" : "text-gray-600"
            }`}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {GRUPOS_MUSCULARES.map((grupo) => (
          <TouchableOpacity
            key={grupo}
            className={`px-3 py-1.5 rounded-full border ${
              grupoSelecionado === grupo
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
            onPress={() =>
              setGrupoSelecionado((prev) => (prev === grupo ? null : grupo))
            }
          >
            <Text
              className={`text-sm font-medium ${
                grupoSelecionado === grupo ? "text-white" : "text-gray-600"
              }`}
            >
              {grupo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 text-center mb-4">
            Erro ao carregar exercícios.
          </Text>
          <TouchableOpacity
            className="px-4 py-2 bg-blue-600 rounded-xl"
            onPress={() => refetch()}
          >
            <Text className="text-white font-medium">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={exercicios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400 text-base">
                Nenhum exercício encontrado.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB — Novo exercício */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/(tabs)/exercicios/novo")}
        activeOpacity={0.85}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
}
