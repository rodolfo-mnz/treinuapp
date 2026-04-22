import { useLocalSearchParams, router, Stack } from "expo-router";
import { useExercicios } from "../../../src/features/exercicios/useExercicios";
import { View, ActivityIndicator, Text } from "react-native";
import ExercicioForm from "./ExercicioForm";

export default function EditarExercicioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: exercicios, isLoading } = useExercicios();
  const exercicio = exercicios?.find((e) => e.id === id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!exercicio) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Exercício não encontrado.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar Exercício" }} />
      <ExercicioForm
        exercicioInicial={exercicio}
        onSucesso={() => router.back()}
      />
    </>
  );
}
