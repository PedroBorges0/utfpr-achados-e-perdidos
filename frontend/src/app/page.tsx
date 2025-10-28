"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/api";
import ItemCard from "@/components/ItemCard";
import { useRouter } from "next/navigation";

// Definindo o tipo para os dados da API
interface ItemAPI {
  id_item: number;
  titulo: string;
  descricao: string;
  data_encontrado: string;
  Categoria?: { nome: string };
  LocalEncontrado?: { nome: string };
  StatusAtual?: { descricao: string };
  imagem?: string;
}

export default function Vitrine() {
  const router = useRouter();
  const [items, setItems] = useState<ItemAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  // --- VERIFICA AUTENTICAÇÃO E CARREGA ITENS ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsAuthenticated(true);
        setUserName(user.nome.split(" ")[0]);
      } catch {
        localStorage.clear();
      }
    }

    const fetchItems = async () => {
      try {
        const response = await api.get("/itens");
        const data = response.data.map((item: ItemAPI) => ({
          ...item,
          imagem: item.imagem
            ? `http://localhost:4000/uploads/${item.imagem}`
            : "/images/default.png", // fallback
        }));
        setItems(data);
      } catch (err: any) {
        setError(
          "Erro ao carregar itens: " +
            (err.message || "Verifique se o backend está rodando na porta 4000.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserName("");
    router.push("/login");
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <p className="text-center text-xl font-semibold">
          Carregando itens do banco de dados...
        </p>
      );

    if (error)
      return (
        <p className="text-center text-xl font-semibold text-red-500">
          Erro: {error}
        </p>
      );

    if (items.length === 0)
      return (
        <p className="text-center text-xl font-semibold text-gray-600">
          Nenhum item cadastrado no sistema.
        </p>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <ItemCard key={item.id_item} item={item} />
        ))}
      </div>
    );
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-7xl p-10 rounded-2xl border-4 border-gray-700 shadow-2xl"
        style={{ backgroundColor: "var(--form-background)" }}
      >
        <header className="flex items-center justify-between w-full mb-12">
          <Image src="/utfpr-logo.png" alt="Logo UTFPR" width={200} height={200} />
          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md">
            ACHADOS E PERDIDOS
          </h1>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-700">
                Olá, {userName}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-bold text-md px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gray-800 text-white font-bold text-md px-8 py-3 rounded-full shadow-lg hover:bg-black transition-colors"
            >
              Login
            </Link>
          )}
        </header>

        {renderContent()}
      </div>

      {/* BOTÃO DE CADASTRO DE ITEM */}
      <div className="fixed bottom-8 right-8">
        <Link
          href={isAuthenticated ? "/cadastro" : "/login"}
          className="bg-yellow-400 text-yellow-900 font-bold text-lg px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
        >
          Cadastrar um item
        </Link>
      </div>
    </main>
  );
}
