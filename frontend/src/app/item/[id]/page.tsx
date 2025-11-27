"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { ItemAPI } from "@/types/ItemAPI";

interface ItemDetalhado extends ItemAPI {
  CadastradoPor?: {
    nome: string;
    email: string;
    telefone: string | null;
  } | null;
}

export default function ItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [item, setItem] = useState<ItemDetalhado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const resp = await api.get(`/itens/${id}`);

        const data = resp.data;

        setItem({
          ...data,
          imagem: data.imagem
            ? `http://localhost:4000/uploads/${data.imagem}`
            : "/images/default.png",
        });
      } catch (err: any) {
        console.error("Erro ao carregar item:", err);
        setError("Erro ao carregar item.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-400 text-black">
        Carregando item...
      </main>
    );

  if (error || !item)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-400 text-black">
        <p className="text-xl font-semibold mb-4">{error || "Item não encontrado."}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-800"
        >
          Voltar
        </button>
      </main>
    );

  const formattedDate = new Date(item.data_encontrado).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#FACC15" }}
    >
      <div className="w-full max-w-4xl bg-[#fffbe6] p-10 rounded-2xl border-4 border-gray-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold bg-yellow-400 px-6 py-3 rounded-xl shadow">
            DETALHES DO ITEM
          </h1>

          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 shadow-md"
          >
            Voltar
          </button>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Imagem */}
          <div className="flex items-center justify-center">
            <Image
              src={item.imagem || "/images/default.png"}
              alt={item.titulo}
              width={350}
              height={350}
              unoptimized
              className="rounded-xl border-4 border-gray-600 shadow-md"
            />
          </div>

          {/* Informações */}
          <div className="space-y-4 text-gray-800">

            <h2 className="text-3xl font-bold">{item.titulo}</h2>

            <p className="text-lg">
              <span className="font-semibold">Descrição:</span> {item.descricao}
            </p>

            <p className="text-lg">
              <span className="font-semibold">Local encontrado:</span>{" "}
              {item.LocalEncontrado?.nome || "N/A"}
            </p>

            <p className="text-lg">
              <span className="font-semibold">Status:</span>{" "}
              {item.StatusAtual?.descricao || "N/A"}
            </p>

            <p className="text-lg">
              <span className="font-semibold">Data:</span> {formattedDate}
            </p>

            {/* Dados do usuário que cadastrou */}
            <div className="mt-6 p-4 border-2 border-gray-500 rounded-xl bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">Cadastrado por:</h3>

              <p><span className="font-semibold">Nome:</span> {item.CadastradoPor?.nome}</p>
              
              <p><span className="font-semibold">Email:</span> {item.CadastradoPor?.email}</p>

              <p>
                <span className="font-semibold">Telefone:</span>{" "}
                {item.CadastradoPor?.telefone || "Não informado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}