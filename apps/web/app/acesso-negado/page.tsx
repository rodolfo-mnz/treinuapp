export default function AcessoNegadoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso restrito</h1>
        <p className="text-gray-500 mb-6">
          Esta plataforma é exclusiva para personal trainers. Se você é atleta, baixe o app
          Treinu no seu celular.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Voltar ao login
        </a>
      </div>
    </div>
  )
}
