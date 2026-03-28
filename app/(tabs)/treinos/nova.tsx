import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from "react-native";
import { router, Stack } from "expo-router";
import { useCriarRotina } from "../../../src/features/rotinas/useRotinas";
import { useAuthStore } from "../../../src/features/auth/authStore";

const OBJETIVOS = ["Hipertrofia", "Força", "Resistência", "Emagrecimento", "Reabilitação"];

export default function NovaRotinaScreen() {
  const { session } = useAuthStore();
  const criar = useCriarRotina();

  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleCriar() {
    if (!nome.trim()) {
      setErro("Informe o nome da rotina.");
      return;
    }
    setErro(null);
    try {
      const rotina = await criar.mutateAsync({
        usuario_id: session!.user.id,
        nome: nome.trim(),
        objetivo: objetivo || undefined,
      });
      router.replace({ pathname: "/(tabs)/treinos/[id]", params: { id: rotina.id } });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao criar rotina.");
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ title: "Nova Rotina" }} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 py-6 gap-6">
          {/* Nome */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Nome da rotina *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
              placeholder="Ex: Treino ABC, Push Pull Legs"
              placeholderTextColor="#9ca3af"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Objetivo */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Objetivo (opcional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {OBJETIVOS.map((obj) => (
                <TouchableOpacity
                  key={obj}
                  className={`px-4 py-2 rounded-xl border ${
                    objetivo === obj
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setObjetivo((prev) => (prev === obj ? "" : obj))}
                >
                  <Text
                    className={`text-sm font-medium ${
                      objetivo === obj ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {obj}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {erro ? (
            <Text className="text-red-500 text-sm text-center">{erro}</Text>
          ) : null}

          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-2 ${
              criar.isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleCriar}
            disabled={criar.isPending}
          >
            {criar.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Criar rotina
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
