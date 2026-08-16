export interface ResumoMensalMeiDTO {
  mes: number;
  comercio: number;
  industria: number;
  servicos: number;
  comDocumentoFiscal: number;
  semDocumentoFiscal: number;
  total: number;
}

export interface ApuracaoMeiDTO {
  ano: number;
  mesReferencia: number;
  comercioMes: number;
  industriaMes: number;
  servicosMes: number;
  totalMes: number;
  comDocumentoFiscalMes: number;
  semDocumentoFiscalMes: number;
  acumuladoAno: number;
  limiteAplicavel: number;
  saldoDisponivel: number;
  percentualUtilizado: number;
  projecaoAnual: number;
  mesesLimite: number;
  quantidadePendencias: number;
  meses: ResumoMensalMeiDTO[];
  detalhes: DetalheApuracaoMeiDTO[];
  situacaoFechamento?: 'FECHADA' | 'REABERTA';
  dataFechamento?: string;
  usuarioFechamento?: string;
  motivoReabertura?: string;
}

export interface RelatorioMensalMeiDTO {
  cnpj: string;
  razaoSocial: string;
  ano: number;
  mes: number;
  situacao?: 'FECHADA';
  comercioComDocumento: number;
  comercioSemDocumento: number;
  industriaComDocumento: number;
  industriaSemDocumento: number;
  servicosComDocumento: number;
  servicosSemDocumento: number;
  total: number;
  dataFechamento?: string;
  usuarioFechamento?: string;
}

export interface DetalheApuracaoMeiDTO {
  lancamentoId: number;
  descricao: string;
  categoria: string;
  natureza?: 'COMERCIO' | 'INDUSTRIA' | 'SERVICOS';
  competencia: string;
  valor: number;
  documentoFiscalEmitido: boolean;
  incluido: boolean;
  motivoNaoInclusao?: string;
  pendenciaFiscal: boolean;
  descricaoPendencia?: string;
}
