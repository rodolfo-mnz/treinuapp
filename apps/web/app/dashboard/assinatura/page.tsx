import { createClient } from "@/lib/supabase/server"

export default async function AssinaturaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assinatura } = await supabase
    .from("assinaturas")
    .select("*, plano:planos(*)")
    .eq("usuario_id", user!.id)
    .eq("status", "ativo")
    .maybeSingle()

  const { data: planos } = await supabase
    .from("planos")
    .select("*")
    .eq("tipo", "personal")
    .eq("ativo", true)
    .order("preco_mensal")

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assinatura</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Plano atual</h3>
        {assinatura ? (
          <div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{(assinatura.plano as any)?.nome}</p>
            <p className="text-gray-500 text-sm mt-1">
              R$ {Number((assinatura.plano as any)?.preco_mensal).toFixed(2).replace(".", ",")}/mês
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Status: <span className="text-green-600 font-medium capitalize">{assinatura.status}</span>
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-gray-500 text-sm">Você não tem uma assinatura ativa.</p>
            <p className="text-gray-400 text-xs mt-1">Escolha um plano abaixo para começar.</p>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-4">Planos para Personal Trainers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planos?.map((plano) => {
          const features: string[] = Array.isArray(plano.features) ? plano.features as string[] : []
          const isAtual = (assinatura?.plano as any)?.id === plano.id

          return (
            <div key={plano.id} className={`bg-white rounded-xl border p-6 ${isAtual ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}>
              {isAtual && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-3">Plano atual</span>
              )}
              <h4 className="font-bold text-gray-900 text-lg">{plano.nome}</h4>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                R$ {Number(plano.preco_mensal).toFixed(2).replace(".", ",")}
                <span className="text-sm font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {plano.max_alunos ? `Até ${plano.max_alunos} alunos` : "Alunos ilimitados"}
              </p>
              <ul className="mt-4 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button disabled={isAtual} className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isAtual ? "bg-gray-100 text-gray-400 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}>
                {isAtual ? "Plano ativo" : "Assinar — em breve"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
