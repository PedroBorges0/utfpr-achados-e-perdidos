// src/types/ItemAPI.ts
export interface ItemAPI {
  id_item: number;
  titulo: string;
  descricao: string;
  data_encontrado: string;
  imagem: string | null;

  Categoria?: { nome: string } | null;
  LocalEncontrado?: { nome: string } | null;
  StatusAtual?: { descricao: string; cor_hex?: string } | null;
}