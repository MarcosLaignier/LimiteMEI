export function competenciaAtual() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`;
}

export function periodoDaCompetencia(competencia: string) {
  const [ano, mes] = competencia.split('-').map(Number);
  if (!ano || !mes) return { inicio: '', fim: '' };
  return {
    inicio: `${ano}-${String(mes).padStart(2, '0')}-01`,
    fim: new Date(ano, mes, 0).toISOString().slice(0, 10),
  };
}

export function periodoLabel(inicio: string, fim: string) {
  if (inicio && fim) return `Período de ${inicio} a ${fim}`;
  return 'Todos os registros disponíveis';
}
