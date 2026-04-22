import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Tabs, router } from "expo-router";
import { useAuthStore } from "../../src/features/auth/authStore";

export default function TabsLayout() {
  const { session, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/(auth)/login");
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!session) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { borderTopColor: "#f3f4f6" },
      }}
    >
      <Tabs.Screen name="index"      options={{ title: "Início" }} />
      <Tabs.Screen name="treinos"    options={{ title: "Treinos" }} />
      <Tabs.Screen name="historico"  options={{ title: "Histórico" }} />
      <Tabs.Screen name="exercicios" options={{ title: "Exercícios" }} />
      <Tabs.Screen name="perfil"     options={{ title: "Perfil" }} />
    </Tabs>
  );
}
