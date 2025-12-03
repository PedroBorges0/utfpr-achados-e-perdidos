export interface ItemAPI {
  id_item: number;
  titulo: string;
  descricao: string;
  data_encontrado: string;

  Categoria?: { nome: string } | null;
  LocalEncontrado?: { nome: string } | null;
  StatusAtual?: { descricao: string; cor_hex?: string } | null;

  imagem: string | null;
}