import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@treinu/database"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Garante que o perfil existe para usuários OAuth (Google)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, tipo")
        .eq("id", data.user.id)
        .single()

      if (!profile) {
        // Cria perfil para novo usuário OAuth (padrão: personal na plataforma web)
        const nome =
          data.user.user_metadata["full_name"] ??
          data.user.user_metadata["name"] ??
          data.user.email ??
          "Usuário"

        await supabase.from("profiles").upsert({
          id: data.user.id,
          nome,
          tipo: "personal",
        })
      }

      // Redireciona para dashboard se personal, ou para tela de acesso negado
      const tipo = profile?.tipo ?? "personal"
      if (tipo !== "personal") {
        return NextResponse.redirect(`${origin}/acesso-negado`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Em caso de erro, redireciona para login com mensagem
  return NextResponse.redirect(`${origin}/login?erro=oauth`)
}
