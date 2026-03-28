import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuthStore } from "../../src/features/auth/authStore";

export default function AuthLayout() {
  const { session, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)");
    }
  }, [session, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
