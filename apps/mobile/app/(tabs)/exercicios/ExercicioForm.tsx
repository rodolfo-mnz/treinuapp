import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useCriarExercicio,
  useAtualizarExercicio,
} from "../../../src/features/exercicios/useExercicios";
import {
  GRUPOS_MUSCULARES,
  EQUIPAMENTOS,
} from "../../../src/features/exercicios/exerciciosConstants";
import type { Exercicio } from "../../../src/types/database.types";
import { useAuthStore } from "../../../src/features/auth/authStore";

interface Props {
  exercicioInicial?: Exercicio;
  onSucesso: () => void;
}

export default function ExercicioForm({ exercicioInicial, onSucesso }: Props) {
  const { session } = useAuthStore();
  const criar = useCriarExercicio();
  const atualizar = useAtualizarExercicio();

  const [nome, setNome] = useState(exercicioInicial?.nome ?? "");
  const [grupoMuscular, setGrupoMuscular] = useState(
    exercicioInicial?.grupo_muscular ?? ""
  );
  const [equipamento, setEquipamento] = useState(
    exercicioInicial?.equipamento ?? ""
  );
  const [instrucoes, setInstrucoes] = useState(
    exercicioInicial?.instrucoes ?? ""
  );
  const [erro, setErro] = useState<string | null>(null);

  const carregando = criar.isPending || atualizar.isPending;
  const ehEdicao = !!exercicioInicial;
  const podeEditar =
    !ehEdicao || exercicioInicial.criado_por === session?.user.id;

  async function handleSalvar() {
    if (!nome.trim()) {
      setErro("Informe o nome do exercício.");
      return;
    }
    if (!grupoMuscular) {
      setErro("Selecione o grupo muscular.");
      return;
    }
    if (!equipamento) {
      setErro("Selecione o equipamento.");
      return;
    }
    setErro(null);

    try {
      if (ehEdicao) {
        await atualizar.mutateAsync({
          id: exercicioInicial.id,
          dados: {
            nome: nome.trim(),
            grupo_muscular: grupoMuscular,
            equipamento,
            instrucoes: instrucoes.trim() || null,
          },
        });
      } else {
        await criar.mutateAsync({
          nome: nome.trim(),
          grupo_muscular: grupoMuscular,
          equipamento,
          instrucoes: instrucoes.trim() || undefined,
          criado_por: session!.user.id,
          publico: false,
        });
      }
      onSucesso();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.");
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
        <View className="px-4 py-6 gap-5">
          {/* Nome */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Nome do exercício *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
              placeholder="Ex: Supino Reto com Barra"
              placeholderTextColor="#9ca3af"
              value={nome}
              onChangeText={setNome}
              editable={podeEditar}
            />
          </View>

          {/* Grupo muscular */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Grupo muscular *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {GRUPOS_MUSCULARES.map((grupo) => (
                <TouchableOpacity
                  key={grupo}
                  className={`px-3 py-2 rounded-xl border ${
                    grupoMuscular === grupo
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => podeEditar && setGrupoMuscular(grupo)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      grupoMuscular === grupo ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {grupo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Equipamento */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Equipamento *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EQUIPAMENTOS.map((eq) => (
                <TouchableOpacity
                  key={eq}
                  className={`px-3 py-2 rounded-xl border ${
                    equipamento === eq
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => podeEditar && setEquipamento(eq)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      equipamento === eq ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {eq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Instruções */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Instruções (opcional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
              placeholder="Descreva a execução do exercício..."
              placeholderTextColor="#9ca3af"
              value={instrucoes}
              onChangeText={setInstrucoes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={podeEditar}
            />
          </View>

          {erro ? (
            <Text className="text-red-500 text-sm text-center">{erro}</Text>
          ) : null}

          {podeEditar && (
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 ${
                carregando ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleSalvar}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {ehEdicao ? "Salvar alterações" : "Criar exercício"}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {!podeEditar && (
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-500 text-sm text-center">
                Este é um exercício do sistema e não pode ser editado.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
