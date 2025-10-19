// src/app/cadastro/page.tsx (CORRIGIDO PARA API)
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
        // Data_encontrado é opcional, mas se for preenchido, deve ser válido.
        
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
                // CONVERSÃO CRUCIAL: Envia IDs válidos como números
                id_categoria: parseInt(formData.categoriaNome), 
                id_localizacao_encontrado: parseInt(formData.localNome), 
                // Data: Garante que a data seja enviada no formato YYYY-MM-DD
                data_encontrado: formData.data_encontrado || new Date().toISOString().split('T')[0],
            };

            // Chamada API: ENVIO DO TOKEN JWT NO HEADER
            const response = await api.post('/itens', payload, {
                headers: {
                    Authorization: `Bearer ${token}`, // AQUI ESTÁ O SEGREDO
                },
            });

            alert(`Item '${response.data.item.titulo}' cadastrado com sucesso!`);
            router.push('/'); // Redireciona para a vitrine

        } catch (err: any) {
            // Se a violação de FK ainda ocorrer, o erro virá daqui
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
                    className="w-full max-w-5xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center"
                    style={{ backgroundColor: 'var(--form-background)' }}
                >
                    
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
}