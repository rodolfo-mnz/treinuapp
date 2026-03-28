import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { signOut } from "../../src/features/auth/authService";

export default function HomeScreen() {
  async function handleSair() {
    await signOut();
  }

  return (
    <View className="flex-1 items-center justify-center bg-white gap-4">
      <Text className="text-2xl font-bold text-gray-900">
        Bem-vindo ao Treinu!
      </Text>
      <Text className="text-gray-500">Autenticação funcionando ✓</Text>
      <TouchableOpacity
        className="mt-4 px-6 py-3 bg-red-500 rounded-xl"
        onPress={handleSair}
      >
        <Text className="text-white font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
