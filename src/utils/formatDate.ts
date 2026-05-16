export function formatDateBR(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}