import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useRotinas, useDeletarRotina, useAtivarRotina } from "../../../src/features/rotinas/useRotinas";
import type { Rotina } from "../../../src/types/database.types";

const OBJETIVOS_CORES: Record<string, string> = {
  Hipertrofia:  "bg-blue-100 text-blue-700",
  Força:        "bg-red-100 text-red-700",
  Resistência:  "bg-green-100 text-green-700",
  Emagrecimento:"bg-orange-100 text-orange-700",
  Reabilitação: "bg-purple-100 text-purple-700",
};

export default function TreinosScreen() {
  const { data: rotinas, isLoading, isError, refetch } = useRotinas();
  const deletar  = useDeletarRotina();
  const ativar   = useAtivarRotina();

  function confirmarDelete(rotina: Rotina) {
    Alert.alert(
      "Excluir rotina",
      `Deseja excluir "${rotina.nome}"? Todos os dias e exercícios serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletar.mutate(rotina.id),
        },
      ]
    );
  }

  function renderItem({ item }: { item: Rotina }) {
    const corClasse =
      (item.objetivo && OBJETIVOS_CORES[item.objetivo]) ??
      "bg-gray-100 text-gray-600";

    return (
      <TouchableOpacity
        className="bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100"
        onPress={() =>
          router.push({ pathname: "/(tabs)/treinos/[id]", params: { id: item.id } })
        }
        activeOpacity={0.7}
      >
        {/* Header do card */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2">
              {item.ativa && (
                <View className="w-2 h-2 rounded-full bg-green-500" />
              )}
              <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                {item.nome}
              </Text>
            </View>
            {item.objetivo ? (
              <View className={`self-start mt-1 px-2 py-0.5 rounded-full ${corClasse.split(" ")[0]}`}>
                <Text className={`text-xs font-medium ${corClasse.split(" ")[1]}`}>
                  {item.objetivo}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Ações */}
        <View className="flex-row gap-3 mt-2 pt-3 border-t border-gray-100">
          {!item.ativa && (
            <TouchableOpacity
              className="flex-1 py-2 bg-blue-50 rounded-xl items-center"
              onPress={() => ativar.mutate(item.id)}
            >
              <Text className="text-blue-600 text-sm font-medium">Ativar</Text>
            </TouchableOpacity>
          )}
          {item.ativa && (
            <View className="flex-1 py-2 bg-green-50 rounded-xl items-center">
              <Text className="text-green-600 text-sm font-medium">Ativa</Text>
            </View>
          )}
          <TouchableOpacity
            className="flex-1 py-2 bg-gray-50 rounded-xl items-center"
            onPress={() =>
              router.push({ pathname: "/(tabs)/treinos/[id]", params: { id: item.id } })
            }
          >
            <Text className="text-gray-600 text-sm font-medium">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2 px-4 bg-red-50 rounded-xl items-center"
            onPress={() => confirmarDelete(item)}
          >
            <Text className="text-red-500 text-sm font-medium">Excluir</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Minhas Rotinas" }} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 text-center mb-4">
            Erro ao carregar rotinas.
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
          data={rotinas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-24 px-8">
              <Text className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma rotina ainda
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                Crie sua primeira rotina de treinos.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/(tabs)/treinos/nova")}
        activeOpacity={0.85}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
}
