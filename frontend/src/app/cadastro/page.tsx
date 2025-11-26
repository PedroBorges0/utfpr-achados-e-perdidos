// src/app/cadastro/page.tsx (VERSÃO FINAL UNIFICADA)
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function CadastroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    caracteristicas: "",
    id_categoria: "", // ID como string do select
    id_localizacao_encontrado: "", // ID como string do select
    id_status: "1", // padrão Achado (ID 1)
    data_encontrado: new Date().toISOString().split("T")[0],
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [localizacoes, setLocalizacoes] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // --- CARREGAR CATEGORIAS, LOCALIZAÇÕES E STATUS ---
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchSeeds = async () => {
      try {
        // Rotas que você criou no Backend
        const [catRes, localRes, statusRes] = await Promise.all([
          api.get("/categorias"),
          api.get("/localizacoes"),
          api.get("/statusitens"),
        ]);
        setCategorias(catRes.data);
        setLocalizacoes(localRes.data);
        setStatusList(statusRes.data);
      } catch (err) {
        console.error("Erro ao carregar listas:", err);
        alert("Erro ao carregar listas. Verifique o backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeeds();
  }, [router]);

  // --- INPUT GENÉRICO (para todos os campos) ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- IMAGEM ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // --- VALIDAÇÃO ÚNICA E CORRIGIDA ---
  const validate = () => {
    let tempErrors: any = {};
    if (!formData.titulo) tempErrors.titulo = true;
    if (!formData.descricao) tempErrors.descricao = true;
    
    // Verifica se os campos de SELECT (que devem ser IDs) estão vazios
    if (!formData.id_categoria || formData.id_categoria === "") tempErrors.id_categoria = true;
    if (!formData.id_localizacao_encontrado || formData.id_localizacao_encontrado === "") tempErrors.id_localizacao_encontrado = true;
    if (!formData.id_status || formData.id_status === "") tempErrors.id_status = true;
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- SUBMIT FINAL ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const token = localStorage.getItem("authToken");

    // 1. VERIFICAÇÃO DE TOKEN: (401)
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      // 2. PREPARAÇÃO DO PAYLOAD (Conversão para Number)
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        caracteristicas: formData.caracteristicas,
        id_categoria: parseInt(formData.id_categoria),
        id_localizacao_encontrado: parseInt(formData.id_localizacao_encontrado),
        id_status: parseInt(formData.id_status),
        data_encontrado: formData.data_encontrado || new Date().toISOString().split("T")[0],
      };

      // 3. CHAMADA API: Envio do Token e do Payload
      const response = await api.post("/itens", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token
        },
      });

      alert(`Item '${response.data.item.titulo}' cadastrado com sucesso!`);
      router.push("/"); // Redireciona para a vitrine
    } catch (err: any) {
      const msg =
        err.response?.data?.details ||
        err.response?.data?.msg ||
        "Erro desconhecido ao cadastrar item.";
      alert(`Falha no cadastro: ${msg}. Verifique o console para detalhes.`);
      console.error("Erro completo da API:", err.response || err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        Carregando formulário...
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>UTFPR - Cadastro de item</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-5xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center relative bg-white shadow-2xl"
          style={{ backgroundColor: "var(--form-background)" }}
        >
          {/* BOTÃO DE VOLTAR */}
          <Link
            href="/"
            className="absolute top-4 left-4 bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-black transition-colors"
          >
            ← Voltar
          </Link>

          <Image
            src="/utfpr-logo.png"
            alt="Logo UTFPR"
            width={250}
            height={250}
            className="mb-8"
          />

          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md mb-12">
            CADASTRO DE ITEM
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4"
          >
            <div className="flex flex-col gap-3">
              {/* TÍTULO */}
              <div>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Nome do item / Título:"
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm">✱ Título obrigatório</p>
                )}
              </div>

              {/* DESCRIÇÃO */}
              <div>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descrição detalhada (cor, modelo, marca):"
                  rows={3}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                    errors.descricao ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm">✱ Descrição obrigatória</p>
                )}
              </div>

              {/* CARACTERÍSTICAS */}
              <div>
                <textarea
                  name="caracteristicas"
                  value={formData.caracteristicas}
                  onChange={handleChange}
                  placeholder="Características/Observações (opcional):"
                  rows={2}
                  className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* DATA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data encontrado/perdido:
                </label>
                <input
                  type="date"
                  name="data_encontrado"
                  value={formData.data_encontrado}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* CATEGORIA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione a Categoria:
                </label>
                <select
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                    errors.id_categoria ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione uma categoria --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                {errors.id_categoria && (
                  <p className="text-red-500 text-sm">✱ Campo obrigatório</p>
                )}
              </div>

              {/* LOCALIZAÇÃO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local que foi encontrado/perdido:
                </label>
                <select
                  name="id_localizacao_encontrado"
                  value={formData.id_localizacao_encontrado}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                    errors.id_localizacao_encontrado
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione uma localização --</option>
                  {localizacoes.map((loc) => (
                    <option key={loc.id_localizacao} value={loc.id_localizacao}>
                      {loc.nome}
                    </option>
                  ))}
                </select>
                {errors.id_localizacao_encontrado && (
                  <p className="text-red-500 text-sm">✱ Campo obrigatório</p>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status:
                </label>
                <select
                  name="id_status"
                  value={formData.id_status}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                    errors.id_status ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione o status --</option>
                  {statusList.map((st) => (
                    <option key={st.id_status} value={st.id_status}>
                      {st.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_status && (
                  <p className="text-red-500 text-sm">✱ Campo obrigatório</p>
                )}
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors shadow-md"
              >
                Finalizar cadastro
              </button>
            </div>

            {/* BLOCO DE IMAGEM */}
            <div className="flex flex-col items-center justify-center pt-8">
              <p className="font-semibold text-gray-700 mb-2">
                Anexe uma imagem (opcional)
              </p>
              <div className="w-60 h-60 bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 mb-4 overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Preview da imagem"
                    width={240}
                    height={240}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  "Nenhuma imagem"
                )}
              </div>
              <label
                htmlFor="file-upload"
                className="bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
              >
                Escolher imagem
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}