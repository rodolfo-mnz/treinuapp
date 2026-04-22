/** Remove tudo que não for dígito */
function soDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Aplica a máscara 000.000.000-00 */
export function mascaraCpf(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Valida CPF pelo algoritmo dos dígitos verificadores */
export function validarCpf(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false; // todos iguais (ex: 111.111.111-11)

  const calc = (fator: number) => {
    let soma = 0;
    for (let i = 0; i < fator - 1; i++) {
      soma += parseInt(d[i] ?? "0") * (fator - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 || resto === 11 ? 0 : resto;
  };

  return calc(10) === parseInt(d[9] ?? "0") && calc(11) === parseInt(d[10] ?? "0");
}
