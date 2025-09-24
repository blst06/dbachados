
export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: string;
  senha?: string;
}
export interface AllUsers {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: string;
}
export interface Tema {
  id: string;
  tema: string;
}
export interface UserUpdate {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: string;
}
export interface UserLogin {
  email: string;
  password: string;
}

export interface EmailChanger extends UserLogin {
  
}

export interface PasswordChanger extends UserLogin {
  confirmPassword:string;
}
export interface AuthData {
  token: string;
  email: string;
}

//Data Table
export interface TopicoAchado {
  id: string;
  tema: string;
  situacao: boolean;
}

export interface Achado {
  id?: string;
  achado: string;
  data: Date;
  gravidade: string;
  criterioGeral?: string;
  situacaoAchado: boolean;
  analise: string;
  tema_id: string;
  tipo_financeiro:boolean;
}

export interface AchadoTransformado extends Omit<Achado, 'tema_id'> {
  tema_id: string | TopicoAchado['tema'];
}

export interface  AchadoPesquisa {
  id?: string;
  achado: string;
  data: Date;
  situacaoAchado: boolean;
  tema_id: string;
}
export interface ColumnConfig {
  id: string;
  label: string;
  minWidth: number;
};

export interface Coleta {
  id:string;
  quantitativo:number;
  unidade:string;
  sanado:string;
  valorFinanceiro:number;
  situacao_encontrada?:string;
  comentario:string;
  coletadorId:string;
  temaId:string;
  achadoId:string;
  processoId:string;
}

export interface ColetaUpdate {
  coleta:Coleta;
  processo:Processo;
  achado:Achado;
  tema:TopicoAchado
}

export interface Processo {
  id: string;
  numero: string;
  exercicio: string;
  julgado: string;
  unidadeGestora: string;
  diretoria: string;
}

export interface Diretoria {
  id:string;
  label:string;
}

export interface KeyWord {
  id: string;
  label: string;
  type:string;
}

export interface KeyWordUpdate extends KeyWord {
  
}

export interface ColetaTransformada extends Omit<Coleta, 'achadoId' | 'processoId' | 'temaId'> {
  achadoId: string | Achado['achado'];
  processoId: string | Processo['numero'];
  temaId: string | TopicoAchado['tema'];
}







