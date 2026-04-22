import { createClient } from "@/lib/supabase/server"

export default async function ExerciciosPage() {
  const supabase = await createClient()

  const { data: exercicios } = await supabase
    .from("exercicios")
    .select("id, nome, grupo_muscular, equipamento, publico")
    .order("nome")

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Exercícios</h2>
        <span className="text-sm text-gray-400">{exercicios?.length ?? 0} exercícios</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!exercicios || exercicios.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Nenhum exercício cadastrado ainda.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo muscular</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamento</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visibilidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exercicios.map((ex) => (
                <tr key={ex.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{ex.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{ex.grupo_muscular ?? "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{ex.equipamento ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      ex.publico ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {ex.publico ? "Público" : "Privado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
