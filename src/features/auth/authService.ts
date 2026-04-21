import { supabase } from "../../lib/supabase";
import type { TipoPerfil } from "../../types/database.types";

export type { TipoPerfil };

export async function signIn(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) throw error;
  return data;
}

export async function signUp(
  email: string,
  senha: string,
  nome: string,
  tipo: TipoPerfil,
  cpf: string,
  dataNascimento: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, tipo, cpf, data_nascimento: dataNascimento },
    },
  });
  if (error) throw error;

  // O perfil é criado automaticamente pelo trigger on_auth_user_created.
  // Não inserimos aqui para evitar falha de RLS quando a sessão ainda é null
  // (caso confirmação de e-mail esteja ativa no Supabase).

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
