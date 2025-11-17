"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/api";
import ItemCard from "@/components/ItemCard";
import { useRouter } from "next/navigation";

interface ItemAPI {
  id_item: number;
  titulo: string;
  descricao: string;
  data_encontrado: string;
  Categoria?: { nome: string };
  LocalEncontrado?: { nome: string };
  StatusAtual?: { descricao: string; cor_hex?: string };
  imagem?: string;
}

export default function Vitrine() {
  const router = useRouter();
  const [items, setItems] = useState<ItemAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");

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
            : "/images/default.png",
        }));

        setItems(data);
      } catch (err: any) {
        setError(
          "Erro ao carregar itens: " +
            (err.message ||
              "Verifique se o backend está rodando na porta 4000.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

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
      <div className="w-full bg-white border-b-4 border-black px-8 py-3 flex items-center justify-between fixed top-0 left-0 z-50">

        <div className="flex items-center gap-6">

          <Image
            src="/utfpr-logo.png"
            alt="Logo UTFPR"
            width={140}
            height={140}
          />

          <div className="flex flex-col items-center">
            <Image
              src={isAuthenticated ? avatar : "/default-avatar.png"}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full border border-gray-400"
              unoptimized
            />
            <span className="text-md font-semibold text-gray-800 mt-1">
              {isAuthenticated ? userName : "Anônimo"}
            </span>
          </div>

        </div>

        <div className="flex items-center gap-8">

          {isAuthenticated ? (
            <>
              <Link
                href="/perfil"
                className="text-black font-semibold hover:border-b-2 hover:border-black pb-1 transition"
              >
                Ver Perfil
              </Link>

              <Link
                href="/cadastro"
                className="text-black font-semibold hover:border-b-2 hover:border-black pb-1 transition"
              >
                Cadastrar item
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-red-700 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/cadastro"
                className="text-black font-semibold hover:border-b-2 hover:border-black pb-1 transition"
              >
                Cadastrar item
              </Link>

              <Link
                href="/login"
                className="text-black font-semibold hover:border-b-2 hover:border-black pb-1 transition"
              >
                Login
              </Link>
            </>
          )}

        </div>
      </div>

      <div
        className="w-full max-w-7xl p-0 rounded-2xl border-4 border-gray-700 shadow-2xl overflow-hidden mt-32"
        style={{ backgroundColor: "var(--form-background)" }}
      >
        <header className="w-full flex items-center justify-center px-10 py-10">
          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md">
            ACHADOS E PERDIDOS
          </h1>
        </header>

        <div className="px-10 pb-10">{renderContent()}</div>
      </div>
    </main>
  );
}