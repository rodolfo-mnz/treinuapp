import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@treinu/database"

export default async function AlunosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: relacoes } = await supabase
    .from("treinador_alunos")
    .select("aluno_id, status, created_at")
    .eq("treinador_id", user!.id)
    .order("created_at", { ascending: false })

  const alunoIds = relacoes?.map((r) => r.aluno_id) ?? []

  let profiles: Profile[] = []
  if (alunoIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("id", alunoIds)
    profiles = data ?? []
  }

  const alunosComStatus = profiles.map((p) => ({
    ...p,
    status: relacoes?.find((r) => r.aluno_id === p.id)?.status ?? "ativo",
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alunos</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Convidar aluno
        </button>
      </div>

      {alunosComStatus.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Você ainda não tem alunos cadastrados.</p>
          <p className="text-gray-400 text-sm mt-1">
            Convide alunos pelo botão acima para começar.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alunosComStatus.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{aluno.nome}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      aluno.status === "ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {aluno.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/dashboard/alunos/${aluno.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver perfil →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
