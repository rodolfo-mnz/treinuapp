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
import { signUp, type TipoPerfil } from "../../src/features/auth/authService";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipo, setTipo] = useState<TipoPerfil>("atleta");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmacaoPendente, setConfirmacaoPendente] = useState(false);

  async function handleCadastrar() {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      const data = await signUp(email.trim(), senha, nome.trim(), tipo);
      if (!data.session) {
        // Confirmação de e-mail ativa: sessão só existe após confirmar
        setConfirmacaoPendente(true);
      }
      // Se session existir, onAuthStateChange redireciona automaticamente
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao cadastrar.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  if (confirmacaoPendente) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-5xl mb-6">📧</Text>
        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
          Confirme seu e-mail
        </Text>
        <Text className="text-gray-500 text-center mb-6 leading-6">
          Enviamos um link de confirmação para{" "}
          <Text className="font-semibold text-gray-700">{email}</Text>.{"\n"}
          Acesse seu e-mail e clique no link para ativar sua conta.
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity className="px-6 py-3 bg-blue-600 rounded-xl">
            <Text className="text-white font-semibold">Ir para o Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
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
        <View className="flex-1 px-6 py-12">
          {/* Título */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Criar conta
            </Text>
            <Text className="text-gray-500 mt-1">
              Comece a acompanhar seus treinos.
            </Text>
          </View>

          {/* Formulário */}
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
                placeholder="Seu nome"
                placeholderTextColor="#9ca3af"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>

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
                  placeholder="Mínimo 6 caracteres"
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

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
                placeholder="Repita a senha"
                placeholderTextColor="#9ca3af"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
              />
            </View>

            {/* Tipo de conta */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tipo de conta
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center border-2 ${
                    tipo === "atleta"
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setTipo("atleta")}
                >
                  <Text
                    className={`font-semibold ${
                      tipo === "atleta" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Atleta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center border-2 ${
                    tipo === "personal"
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setTipo("personal")}
                >
                  <Text
                    className={`font-semibold ${
                      tipo === "personal" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Personal Trainer
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
              onPress={handleCadastrar}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Cadastrar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Já tem conta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
