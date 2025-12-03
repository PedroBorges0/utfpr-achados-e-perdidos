"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/api";
import ItemCard from "@/components/ItemCard";
import { useRouter } from "next/navigation";

import type { ItemAPI } from "@/types/ItemAPI";

export default function Vitrine() {
  const router = useRouter();

  const [items, setItems] = useState<ItemAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Anônimo");
  const [avatar, setAvatar] = useState("/default-avatar.png");

  const [searchQuery, setSearchQuery] = useState("");

  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterLocal, setFilterLocal] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [categorias, setCategorias] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsAuthenticated(true);
        setUserName(user.nome.split(" ")[0]);
        if (user.avatar) setAvatar(user.avatar);
      } catch {
        localStorage.clear();
      }
    }

    const fetchItems = async () => {
      try {
        const response = await api.get("/itens");
        const data: ItemAPI[] = response.data.map((item: any) => ({
          ...item,
          imagem: item.imagem
            ? `http://localhost:4000/uploads/${item.imagem}`
            : "/images/default.png",
        }));

        setItems(data);
      } catch (err: any) {
        setError("Erro ao carregar itens: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFilters = async () => {
      try {
        const [cats, locs, stats] = await Promise.all([
          api.get("/categorias"),
          api.get("/localizacoes"),
          api.get("/statusitens"),
        ]);

        setCategorias(cats.data);
        setLocais(locs.data);
        setStatusList(stats.data);
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };

    fetchItems();
    fetchFilters();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    router.push("/login");
  };

  const applyFilters = () => {
    let filtered = items;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategoria !== "") {
      filtered = filtered.filter(
        (item) => item.Categoria?.nome === filterCategoria
      );
    }

    if (filterLocal !== "") {
      filtered = filtered.filter(
        (item) => item.LocalEncontrado?.nome === filterLocal
      );
    }

    if (filterStatus !== "") {
      filtered = filtered.filter(
        (item) => item.StatusAtual?.descricao === filterStatus
      );
    }

    return filtered;
  };

  const filteredItems = applyFilters();

  const renderContent = () => {
    if (isLoading)
      return <p className="text-center text-xl font-semibold">Carregando itens...</p>;

    if (error)
      return (
        <p className="text-center text-xl font-semibold text-red-500">
          {error}
        </p>
      );

    if (filteredItems.length === 0)
      return (
        <p className="text-center text-xl font-semibold text-gray-600">
          Nenhum item encontrado.
        </p>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
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
      <div className="w-full bg-white border-b-4 border-black px-8 py-3 flex items-center justify-between gap-6 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-6">
          <Image src="/utfpr-logo.png" alt="Logo UTFPR" width={130} height={130} />

          <div className="flex flex-col items-center">
            <Image
              src={avatar}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full border border-gray-400"
              unoptimized
            />
            <span className="text-md font-semibold text-gray-800 mt-1">
              {userName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-400 rounded-full w-64 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">🔍</button>
          </div>

          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="border border-gray-400 rounded-full px-3 py-2 bg-white"
          >
            <option value="">Categoria</option>
            {categorias.map((c: any) => (
              <option key={c.id_categoria} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>

          <select
            value={filterLocal}
            onChange={(e) => setFilterLocal(e.target.value)}
            className="border border-gray-400 rounded-full px-3 py-2 bg-white"
          >
            <option value="">Local</option>
            {locais.map((l: any) => (
              <option key={l.id_localizacao} value={l.nome}>
                {l.nome}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-400 rounded-full px-3 py-2 bg-white"
          >
            <option value="">Status</option>
            {statusList.map((s: any) => (
              <option key={s.id_status} value={s.descricao}>
                {s.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
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
                className="bg-red-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-red-700 transition"
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
        className="w-full max-w-7xl p-0 rounded-2xl border-4 border-gray-700 shadow-2xl overflow-hidden mt-40"
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