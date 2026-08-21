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
  mediaMensalDisponivel: number;
  faixaAlerta: 'NORMAL' | 'ATENCAO_75' | 'ALERTA_80' | 'CRITICO_90' | 'EXCEDIDO_100';
  mesesLimite: number;
  quantidadePendencias: number;
  quantidadeLancamentosAbertos: number;
  quantidadeLancamentosVencidos: number;
  competenciasAnterioresAbertas: number[];
  meses: ResumoMensalMeiDTO[];
  detalhes: DetalheApuracaoMeiDTO[];
  conferenciaFiscal: ConferenciaFiscalMeiDTO;
  situacaoFechamento?: 'FECHADA' | 'REABERTA';
  dataFechamento?: string;
  usuarioFechamento?: string;
  motivoReabertura?: string;
}

export interface RelatorioMensalMeiDTO {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  dataAbertura: string;
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
  acumuladoAno: number;
  dataFechamento?: string;
  usuarioFechamento?: string;
  conferenciaFiscal: ConferenciaFiscalMeiDTO;
}

export interface DocumentoFiscalApuracaoDTO {
  id: number;
  tipo: 'NFSE' | 'NFE' | 'NFCE' | 'OUTRO';
  numero: string;
  dataEmissao: string;
  cliente?: string;
  situacao: 'EMITIDO' | 'CANCELADO' | 'SUBSTITUIDO';
  valorTotal: number;
  valorVinculado: number;
  diferenca: number;
}

export interface ConferenciaFiscalMeiDTO {
  quantidadeEmitidos: number;
  valorEmitidos: number;
  quantidadeCancelados: number;
  valorCancelados: number;
  percentualDocumentado: number;
  quantidadePendencias: number;
  quantidadeDivergencias: number;
  documentos: DocumentoFiscalApuracaoDTO[];
}

export interface HistoricoApuracaoMeiDTO {
  ano: number;
  limiteAplicavel: number;
  totalAno: number;
  percentualUtilizado: number;
  meses: HistoricoApuracaoMeiItemDTO[];
}

export interface HistoricoApuracaoMeiItemDTO {
  mes: number;
  totalMes: number;
  acumuladoAno: number;
  percentualUtilizado: number;
  situacao?: 'FECHADA' | 'REABERTA';
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
