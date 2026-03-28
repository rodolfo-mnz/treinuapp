import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { signIn } from "../../src/features/auth/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleEntrar() {
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await signIn(email.trim(), senha);
      // Redirecionamento acontece automaticamente via onAuthStateChange
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao entrar.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Logo / Título */}
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-blue-600">Treinu</Text>
            <Text className="text-gray-500 mt-1">Seu treino, seu ritmo.</Text>
          </View>

          {/* Formulário */}
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                E-mail
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
                placeholder="seu@email.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Senha
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50">
                <TextInput
                  className="flex-1 px-4 py-3 text-base text-gray-900"
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="px-4 py-3"
                  onPress={() => setMostrarSenha((v) => !v)}
                >
                  <Text className="text-blue-500 text-sm">
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {erro ? (
              <Text className="text-red-500 text-sm text-center">{erro}</Text>
            ) : null}

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 ${
                carregando ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleEntrar}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Ainda não tem conta? </Text>
            <Link href="/(auth)/cadastro" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
