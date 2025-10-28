"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/api";
import ItemCard from "@/components/ItemCard";
import Head from "next/head";

type UserProfile = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string | null;
};

type ItemAPI = {
  id_item: number;
  titulo: string;
  descricao: string;
  imagem: string | null;
  data_encontrado: string;
  StatusAtual: { descricao: string } | null;
  LocalEncontrado: { nome: string } | null;
};

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userItems, setUserItems] = useState<ItemAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
      router.push("/login");
      return;
    }

    const fetchUserProfileAndItems = async () => {
      try {
        const userResponse = await api.get("/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const itemsResponse = await api.get("/itens/meus-itens", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);
        setUserItems(itemsResponse.data);
      } catch (err: any) {
        console.error("Erro ao buscar perfil ou itens:", err);
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          localStorage.clear();
          router.push("/login");
        } else {
          setError("Não foi possível carregar o perfil ou os itens do usuário.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfileAndItems();
  }, [router]);

  if (isLoading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-400 text-black">
        Carregando perfil...
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-400 text-black p-6">
        <p className="text-xl font-semibold mb-4">{error}</p>
        <Link
          href="/login"
          className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Ir para Login
        </Link>
      </main>
    );

  if (!user)
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-400 text-black">
        Perfil não encontrado.
      </main>
    );

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#FACC15" }}
    >
      <Head>
        <title>UTFPR - Perfil de {user.nome}</title>
      </Head>

      <div className="w-full max-w-7xl bg-[#fffbe6] p-10 rounded-2xl border-4 border-gray-700 shadow-2xl">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <Image
              src="/utfpr-logo.png"
              alt="Logo UTFPR"
              width={180}
              height={180}
            />
            <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md whitespace-nowrap">
              MEU PERFIL
            </h1>
          </div>

          {/* Botão Voltar para Vitrine */}
          <Link
            href="/"
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className="bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-md"
          >
            Voltar para Vitrine
          </Link>
        </header>

        {/* Área de conteúdo dividida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna do Perfil */}
          <div className="col-span-1 bg-white rounded-xl border-4 border-gray-700 p-8 shadow-lg flex flex-col items-center text-center">
            <Image
              src="/default-avatar.png"
              alt="Avatar do Usuário"
              width={120}
              height={120}
              className="rounded-full mb-4 border-2 border-gray-400"
              unoptimized
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
              {user.nome}
            </h2>
            <p className="text-gray-700 text-lg mb-1">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-gray-700 text-lg mb-6">
              <span className="font-semibold">Telefone:</span>{" "}
              {user.telefone || "N/A"}
            </p>

            <button className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-md">
              Editar Perfil
            </button>
          </div>

          {/* Coluna dos Itens */}
          <div className="col-span-2 bg-white rounded-xl border-4 border-gray-700 p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Meus Itens Postados
            </h2>
            {userItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userItems.map((item) => (
                  <ItemCard key={item.id_item} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center text-xl">
                Você ainda não postou nenhum item.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}