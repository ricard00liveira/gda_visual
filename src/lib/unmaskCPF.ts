export function unmaskCPF(cpf: string): string {
  return cpf.replace(/[.\-]/g, "");
}
