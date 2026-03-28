import { useLocalSearchParams, router, Stack } from "expo-router";
import ExercicioForm from "./ExercicioForm";

export default function NovoExercicioScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Novo Exercício" }} />
      <ExercicioForm
        onSucesso={() => router.back()}
      />
    </>
  );
}
