import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";
import type { TipoPerfil } from "../../types/database.types";

export type { TipoPerfil };

// Necessário para fechar o browser de OAuth no web (no-op em nativo)
WebBrowser.maybeCompleteAuthSession();

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

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri({ scheme: "treinu", path: "auth/callback" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        // Solicita access_type=offline para refresh token
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error("URL de autenticação não disponível.");

  // Abre o navegador para OAuth e aguarda retorno
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === "success") {
    const { params, errorCode } = QueryParams.getQueryParams(result.url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token } = params;
    if (!access_token) throw new Error("Token de acesso não recebido.");

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token ?? "",
    });
    if (sessionError) throw sessionError;
  }
  // Se result.type === "cancel" ou "dismiss", não faz nada (usuário cancelou)
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
