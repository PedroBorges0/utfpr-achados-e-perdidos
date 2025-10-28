// src/app/perfil/page.tsx — versão final corrigida e validada
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api";
import ItemCard from "@/components/ItemCard";

// --- Tipos de dados ---
type UserProfile = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipo?: string;
  ativo?: boolean;
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

// --- Componente principal ---
export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userItems, setUserItems] = useState<ItemAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Busca dados do usuário e itens ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [userRes, itemsRes] = await Promise.all([
          api.get("/usuarios/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/itens/meus-itens", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setUserItems(itemsRes.data);
      } catch (err: any) {
        console.error("Erro ao carregar perfil:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          setError("Sessão expirada. Faça login novamente.");
          router.push("/login");
        } else {
          setError("Não foi possível carregar os dados do perfil.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  // --- Loading ---
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 text-lg font-semibold">
        Carregando perfil...
      </main>
    );
  }

  // --- Erro ---
  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 text-red-600 text-center">
        <p>{error}</p>
        <Link
          href="/login"
          className="mt-4 text-blue-600 hover:underline text-lg font-semibold"
        >
          Ir para Login
        </Link>
      </main>
    );
  }

  // --- Sem usuário ---
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        Perfil não encontrado.
      </main>
    );
  }

  // --- Render principal ---
  return (
    <>
      <Head>
        <title>UTFPR - Perfil de {user.nome}</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4 bg-yellow-50">
        <div className="w-full max-w-7xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center bg-white shadow-2xl">
          {/* Cabeçalho */}
          <header className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
            <Image
              src="/utfpr-logo.png"
              alt="Logo UTFPR"
              width={150}
              height={150}
              className="select-none"
            />

            <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md text-center">
              MEU PERFIL
            </h1>

            <Link
              href="/"
              className="bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
            >
              Voltar para Vitrine
            </Link>
          </header>

          {/* Conteúdo */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Bloco Perfil */}
            <div className="col-span-1 bg-white/90 rounded-lg shadow-lg p-6 border-4 border-gray-700 flex flex-col items-center">
              <Image
                src="/default-avatar.png"
                alt="Avatar do Usuário"
                width={120}
                height={120}
                className="rounded-full mb-4 border-2 border-gray-400"
                unoptimized
              />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {user.nome}
              </h2>
              <p className="text-gray-700 text-lg mb-1">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-700 text-lg mb-4">
                <span className="font-semibold">Telefone:</span>{" "}
                {user.telefone || "N/A"}
              </p>

              <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
                Editar Perfil
              </button>
            </div>

            {/* Bloco Itens */}
            <div className="col-span-2 bg-white/90 rounded-lg shadow-lg p-6 border-4 border-gray-700">
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
    </>
  );
}