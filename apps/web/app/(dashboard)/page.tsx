import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Total de alunos ativos
  const { count: totalAlunos } = await supabase
    .from("treinador_alunos")
    .select("*", { count: "exact", head: true })
    .eq("treinador_id", user!.id)
    .eq("status", "ativo")

  // Alunos que treinaram hoje
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const { data: idsAlunos } = await supabase
    .from("treinador_alunos")
    .select("aluno_id")
    .eq("treinador_id", user!.id)
    .eq("status", "ativo")

  const alunoIds = idsAlunos?.map((r) => r.aluno_id) ?? []

  let treinaramHoje = 0
  if (alunoIds.length > 0) {
    const { count } = await supabase
      .from("treino_sessoes")
      .select("*", { count: "exact", head: true })
      .in("usuario_id", alunoIds)
      .gte("iniciado_em", hoje.toISOString())

    treinaramHoje = count ?? 0
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Alunos ativos</p>
          <p className="text-3xl font-bold text-gray-900">{totalAlunos ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Treinaram hoje</p>
          <p className="text-3xl font-bold text-blue-600">{treinaramHoje}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Treinando agora</p>
          <p className="text-3xl font-bold text-green-600">—</p>
          <p className="text-xs text-gray-400 mt-1">Realtime em breve</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Atividade recente</h3>
        {alunoIds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Você ainda não tem alunos.</p>
            <a
              href="/dashboard/alunos"
              className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
            >
              Convidar primeiro aluno →
            </a>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Histórico detalhado em breve.</p>
        )}
      </div>
    </div>
  )
}
