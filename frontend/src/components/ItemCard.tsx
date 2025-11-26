"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ItemAPI } from "@/types/ItemAPI";

type Props = {
  item: ItemAPI;
};

export default function ItemCard({ item }: Props) {
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
    <Link href={`/item/${item.id_item}`} passHref>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-4 border-gray-700 cursor-pointer">
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{item.titulo}</h3>

          {/* Imagem */}
          <div className="relative w-full h-40 mb-4 flex items-center justify-center">
            <Image
              src={item.imagem || "/images/default.png"}
              alt={item.titulo}
              width={150}
              height={150}
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Detalhes */}
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {item.StatusAtual?.descricao || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Descrição:</span> {item.descricao}
            </p>

            <p>
              <span className="font-semibold">Local:</span>{" "}
              {item.LocalEncontrado?.nome || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Data:</span> {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}