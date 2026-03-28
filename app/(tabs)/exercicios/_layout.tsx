import { Stack } from "expo-router";

export default function ExerciciosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#2563eb",
        headerTitleStyle: { fontWeight: "600", color: "#111827" },
        headerShadowVisible: false,
      }}
    />
  );
}
