
export type UserRole = 'adm' | 'gerente' | 'vendedor';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
  job_title?: string;
  created_at: string;
}

export type BoletoStatus = 'emitido' | 'enviado' | 'pago' | 'vencido';

export interface Fatura {
  id: string;
  created_at: string;
  uc_codigo: string;
  cliente_nome: string;
  cliente_cpf_cnpj: string;
  tipo_ligacao: string;
  mes_referencia: string;
  data_vencimento: string;
  valor_fatura_distribuidora: number;
  valor_economia_gd: number;
  status_boleto_vigor: string;
  pdf_fatura?: string;
}

export interface BoletoVigor {
  id: string;
  fatura_id: string;
  valor_total: number;
  valor_desconto: number;
  data_emissao: string;
  data_vencimento: string;
  status: BoletoStatus;
  pdf_boleto_url?: string;
  codigo_barras: string;
  created_at: string;
}

export type PropostaStatus = 'proposta_feita' | 'contrato_enviado' | 'contrato_analise' | 'contrato_aprovado' | 'contrato_cancelado' | 'expirada';

export interface Proposta {
  id: string;
  vendedor_id: string;
  cliente_nome: string;
  status: PropostaStatus;
  data_criacao: string;
  data_validade: string;
  valor_estimado?: number;
}

export type TarefaStatus = 'a_iniciar' | 'em_andamento' | 'aguardando' | 'concluido' | 'cancelado';
export type TarefaPrioridade = 'baixa' | 'media' | 'alta';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  responsavel_id: string;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  vencimento: string;
  anexos_url?: string[];
  created_at: string;
}
