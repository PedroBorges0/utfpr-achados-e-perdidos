// src/components/ItemCard.tsx (corrigido e final)
"use client";
import React from "react";
import Image from "next/image";

interface ItemCardProps {
  item: {
    id_item: number;
    titulo: string;
    descricao: string;
    imagem?: string | null;
    data_encontrado: string;
    Categoria?: { nome: string } | null;
    LocalEncontrado?: { nome: string } | null;
    StatusAtual?: { descricao: string; cor_hex?: string } | null;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  // Corrige caminho da imagem (caso o backend sirva em /uploads)
  const imageUrl =
    item.imagem && !item.imagem.startsWith("http")
      ? `http://localhost:4000/uploads/${item.imagem}`
      : item.imagem || "/images/default.png";

  // Formata a data
  let formattedDate = "N/A";
  if (item.data_encontrado) {
    try {
      formattedDate = new Date(item.data_encontrado).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      formattedDate = "Data Inválida";
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-300 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
      {/* Imagem */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.titulo}
          fill
          unoptimized
          className="object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between h-56">
        <div>
          <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
            {item.titulo}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {item.descricao}
          </p>

          {/* Categoria e Local */}
          <p className="text-sm text-gray-700 font-medium">
            📦 Categoria:{" "}
            <span className="font-normal">
              {item.Categoria?.nome || "Não informada"}
            </span>
          </p>
          <p className="text-sm text-gray-700 font-medium">
            📍 Local:{" "}
            <span className="font-normal">
              {item.LocalEncontrado?.nome || "Não informado"}
            </span>
          </p>
        </div>

        {/* Rodapé */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">🗓 {formattedDate}</span>
          {item.StatusAtual && (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: item.StatusAtual.cor_hex || "#4B5563",
                color: "#fff",
              }}
            >
              {item.StatusAtual.descricao}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}