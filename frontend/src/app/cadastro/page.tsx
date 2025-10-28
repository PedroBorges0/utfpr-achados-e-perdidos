
// src/app/cadastro/page.tsx (FINAL COM BOTÃO DE VOLTAR)
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api";
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        titulo: "", 
        descricao: "",
        caracteristicas: "",
        localNome: "", 
        categoriaNome: "",
        data_encontrado: new Date().toISOString().split('T')[0], // Define a data de hoje por padrão (YYYY-MM-DD)
    });
    
    // Estados para carregar dados de seed (categorias/localizacoes)
    const [categorias, setCategorias] = useState<any[]>([]);
    const [localizacoes, setLocalizacoes] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // --- CARREGAR DADOS INICIAIS E VERIFICAR AUTENTICAÇÃO ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchSeeds = async () => {
            try {
                // Rotas GET /api/categorias e /api/localizacoes que criamos
                const [catRes, localRes] = await Promise.all([
                    api.get('/categorias'),
                    api.get('/localizacoes'),
                ]);
                setCategorias(catRes.data);
                setLocalizacoes(localRes.data);
            } catch (err) {
                console.error("Falha ao carregar seeds:", err);
                alert("Erro ao carregar listas de categoria/local. Verifique se o backend está rodando.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeeds();
    }, [router]);

    // Lógica do formulário (mantida)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Ajustado para aceitar input, select e textarea
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validate = () => {
        let tempErrors: any = {};
        if (!formData.titulo) tempErrors.titulo = true;
        if (!formData.descricao) tempErrors.descricao = true;
        if (!formData.categoriaNome) tempErrors.categoriaNome = true;
        if (!formData.localNome) tempErrors.localNome = true;
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            console.log("Formulário inválido, corrija os erros.");
            return;
        }

        const token = localStorage.getItem('authToken');
        
        try {
            const payload = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                caracteristicas: formData.caracteristicas,
                id_categoria: parseInt(formData.categoriaNome), 
                id_localizacao_encontrado: parseInt(formData.localNome), 
                data_encontrado: formData.data_encontrado || new Date().toISOString().split('T')[0],
            };

            // Chamada API: ENVIO DO TOKEN JWT NO HEADER
            const response = await api.post('/itens', payload, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            alert(`Item '${response.data.item.titulo}' cadastrado com sucesso!`);
            router.push('/'); // Redireciona para a vitrine

        } catch (err: any) {
            const msg = err.response?.data?.details || err.response?.data?.msg || "Erro desconhecido ao cadastrar item.";
            alert(`Falha no cadastro: ${msg}. Verifique o console para detalhes.`);
            console.error("Erro completo da API:", err.response || err);
        }
    };
    
    if (isLoading) {
        return <main className="min-h-screen flex items-center justify-center p-4">Carregando formulário...</main>;
    }


    return (
        <>
            <Head>
                <title>UTFPR - Cadastro de item</title>
            </Head>

            <main className="min-h-screen flex items-center justify-center p-4">
                <div 
                    className="w-full max-w-5xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center relative" // Adicionado 'relative' para o botão
                    style={{ backgroundColor: 'var(--form-background)' }}
                >
                    
                    {/* BOTÃO DE VOLTAR PARA A VITRINE */}
                    <Link 
                        href="/" 
                        className="absolute top-4 left-4 bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-black transition-colors"
                    >
                        &larr; Voltar
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

                    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                        <div className="flex flex-col gap-3">
                            
                            {/* CAMPO: TÍTULO */}
                            <div>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Nome do item / Título:"
                                    className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                />
                                {errors.titulo && <p className="error-message text-red-500">✱ Título obrigatório</p>}
                            </div>

                            {/* CAMPO: DESCRIÇÃO (TEXTAREA) */}
                            <div>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    placeholder="Descrição detalhada (cor, modelo, marca):"
                                    rows={3}
                                    className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.descricao ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                />
                                {errors.descricao && <p className="error-message text-red-500">✱ Descrição obrigatória</p>}
                            </div>

                            {/* CAMPO: CARACTERÍSTICAS/OBSERVAÇÕES (TEXTAREA) */}
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

                            {/* CAMPO: DATA ENCONTRADO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data que o item foi encontrado/perdido:</label>
                                <input
                                    type="date"
                                    name="data_encontrado"
                                    value={formData.data_encontrado}
                                    onChange={handleChange}
                                    aria-label="Data"
                                    className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>


                            {/* CAMPO: CATEGORIA (SELECT) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Categoria:</label>
                                <select
                                    name="categoriaNome"
                                    value={formData.categoriaNome}
                                    onChange={handleChange}
                                    className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.categoriaNome ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                >
                                    <option value="">-- Selecione uma categoria --</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoriaNome && <p className="error-message text-red-500">✱ Seleção obrigatória</p>}
                            </div>


                            {/* CAMPO: LOCALIZAÇÃO (SELECT) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Local que foi encontrado/perdido:</label>
                                <select
                                    name="localNome"
                                    value={formData.localNome}
                                    onChange={handleChange}
                                    className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.localNome ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                >
                                    <option value="">-- Selecione uma localização --</option>
                                    {localizacoes.map(loc => (
                                        <option key={loc.id_localizacao} value={loc.id_localizacao}>
                                            {loc.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.localNome && <p className="error-message text-red-500">✱ Seleção obrigatória</p>}
                            </div>

                            
                            <button
                                type="submit"
                                className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
                            >
                                Finalizar cadastro
                            </button>
                        </div>

                        {/* Bloco de Imagem (mantido) */}
                        <div className="flex flex-col items-center justify-center pt-8">
                            <p className="font-semibold text-gray-700 mb-2">
                                Anexe uma imagem
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
                                Anexar imagem
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
=======
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function CadastroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    caracteristicas: "",
    id_categoria: "",
    id_localizacao_encontrado: "",
    id_status: "1", // padrão "Achado"
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

  // --- INPUT GENÉRICO ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // --- VALIDAÇÃO ---
  const validate = () => {
    let tempErrors: any = {};
    if (!formData.titulo) tempErrors.titulo = true;
    if (!formData.descricao) tempErrors.descricao = true;
    if (!formData.id_categoria) tempErrors.id_categoria = true;
    if (!formData.id_localizacao_encontrado) tempErrors.id_localizacao_encontrado = true;
    if (!formData.id_status) tempErrors.id_status = true;
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descricao", formData.descricao);
      data.append("caracteristicas", formData.caracteristicas);
      data.append("id_categoria", formData.id_categoria);
      data.append("id_localizacao_encontrado", formData.id_localizacao_encontrado);
      data.append("id_status", formData.id_status);
      data.append("data_encontrado", formData.data_encontrado);
      if (file) data.append("imagem", file);

      const response = await api.post("/itens", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.msg || "Item cadastrado com sucesso!");
      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.details || err.response?.data?.msg || "Erro ao cadastrar item.";
      alert(`Falha no cadastro: ${msg}`);
      console.error("Erro da API:", err.response || err);
    }
  };

  if (isLoading) {
    return <main className="min-h-screen flex items-center justify-center p-4">Carregando formulário...</main>;
  }

  return (
    <>
      <Head>
        <title>UTFPR - Cadastro de item</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center bg-white shadow-2xl">
          <Image src="/utfpr-logo.png" alt="Logo UTFPR" width={250} height={250} className="mb-8" />

          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md mb-12">
            CADASTRO DE ITEM
          </h1>

          <form onSubmit={handleSubmit} noValidate className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            <div className="flex flex-col gap-3">
              {/* TÍTULO */}
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Título do item"
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.titulo ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.titulo && <p className="text-red-500 text-sm">✱ Campo obrigatório</p>}

              {/* DESCRIÇÃO */}
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição detalhada"
                rows={3}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.descricao ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.descricao && <p className="text-red-500 text-sm">✱ Campo obrigatório</p>}

              {/* CARACTERÍSTICAS */}
              <textarea
                name="caracteristicas"
                value={formData.caracteristicas}
                onChange={handleChange}
                placeholder="Características (opcional)"
                rows={2}
                className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              {/* DATA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data encontrado:</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria:</label>
                <select
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.id_categoria ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione uma categoria --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                {errors.id_categoria && <p className="text-red-500 text-sm">✱ Campo obrigatório</p>}
              </div>

              {/* LOCALIZAÇÃO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local encontrado:</label>
                <select
                  name="id_localizacao_encontrado"
                  value={formData.id_localizacao_encontrado}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.id_localizacao_encontrado ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione uma localização --</option>
                  {localizacoes.map((loc) => (
                    <option key={loc.id_localizacao} value={loc.id_localizacao}>
                      {loc.nome}
                    </option>
                  ))}
                </select>
                {errors.id_localizacao_encontrado && <p className="text-red-500 text-sm">✱ Campo obrigatório</p>}
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                <select
                  name="id_status"
                  value={formData.id_status}
                  onChange={handleChange}
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.id_status ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                >
                  <option value="">-- Selecione o status --</option>
                  {statusList.map((st) => (
                    <option key={st.id_status} value={st.id_status}>
                      {st.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_status && <p className="text-red-500 text-sm">✱ Campo obrigatório</p>}
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
              <p className="font-semibold text-gray-700 mb-2">Anexe uma imagem (opcional)</p>
              <div className="w-60 h-60 bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 mb-4 overflow-hidden">
                {previewImage ? (
                  <Image src={previewImage} alt="Preview da imagem" width={240} height={240} className="object-cover w-full h-full" />
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
              <input id="file-upload" type="file" className="hidden" onChange={handleImageChange} />
            </div>
          </form>
        </div>
      </main>
    </>
  );
>>>>>>> 60ca7e3a2371ed0313740cde5ae034f77cb07a1c
}