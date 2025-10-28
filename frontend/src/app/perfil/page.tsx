// src/app/perfil/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/services/api';
import ItemCard from '@/components/ItemCard'; 
import Head from 'next/head';

// Definição do tipo para o usuário (adapte conforme o seu modelo de usuário)
type UserProfile = {
    id_usuario: number;
    nome: string;
    email: string;
    telefone: string | null;
    // Adicione outros campos do usuário se existirem
};

// Definição do tipo para os itens (baseado na ItemAPI da Vitrine)
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
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('user');

        if (!token || !userJson) {
            router.push('/login'); // Redireciona se não estiver logado
            return;
        }

        const fetchUserProfileAndItems = async () => {
            try {
                // 1. Busca informações completas do usuário logado
                // Esta rota GET /api/usuarios/me precisa ser implementada no Backend
                const userResponse = await api.get('/usuarios/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 2. Busca itens postados pelo usuário logado
                // Esta rota GET /api/itens/meus-itens foi adicionada no itemRoutes.js
                const itemsResponse = await api.get('/itens/meus-itens', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setUserItems(itemsResponse.data);
                setUser(userResponse.data); // Define os dados do perfil

            } catch (err: any) {
                console.error("Erro ao buscar perfil ou itens:", err);
                if (err.response?.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    localStorage.clear();
                    router.push('/login');
                } else {
                    setError("Não foi possível carregar o perfil ou os itens do usuário.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfileAndItems();
    }, [router]);

    if (isLoading) {
        return <main className="min-h-screen flex items-center justify-center p-4">Carregando perfil...</main>;
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 text-red-600">
                <p>{error}</p>
                <Link href="/login" className="ml-4 text-blue-500 hover:underline">Ir para Login</Link>
            </main>
        );
    }

    if (!user) {
        return <main className="min-h-screen flex items-center justify-center p-4">Perfil não encontrado.</main>;
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Head>
                <title>UTFPR - Perfil de {user.nome}</title>
            </Head>
            <div 
                className="w-full max-w-7xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center"
                style={{ backgroundColor: 'var(--form-background)' }}
            >
                <header className="flex items-center justify-between w-full mb-8">
                    <Image src="/utfpr-logo.png" alt="Logo UTFPR" width={150} height={150} />
                    <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md">
                        MEU PERFIL
                    </h1>
                    <Link href="/" className="bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md">
                        Voltar para Vitrine
                    </Link>
                </header>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {/* Coluna do Perfil do Usuário */}
                    <div className="col-span-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-4 border-gray-700 flex flex-col items-center">
                        <Image
                            src="/default-avatar.png" // Crie um avatar padrão em /public
                            alt="Avatar do Usuário"
                            width={120}
                            height={120}
                            className="rounded-full mb-4 border-2 border-gray-400"
                            unoptimized 
                        />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.nome}</h2>
                        <p className="text-gray-700 text-lg mb-1"><span className="font-semibold">Email:</span> {user.email}</p>
                        <p className="text-gray-700 text-lg mb-4"><span className="font-semibold">Telefone:</span> {user.telefone || 'N/A'}</p>
                        
                        <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
                            Editar Perfil
                        </button>
                    </div>

                    {/* Coluna de Itens Postados pelo Usuário */}
                    <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-4 border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meus Itens Postados</h2>
                        {userItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {userItems.map(item => (
                                    // Use o ItemCard existente
                                    <ItemCard key={item.id_item} item={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center text-xl">Você ainda não postou nenhum item.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}