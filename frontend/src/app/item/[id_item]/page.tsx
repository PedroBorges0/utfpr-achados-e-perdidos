"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/services/api';
import Head from 'next/head';

interface ItemDetalhe {
    id_item: number;
    titulo: string;
    descricao: string;
    data_encontrado: string;
    caracteristicas: string | null;
    imagem: string | null;
    id_usuario_cadastrou: number; 
    
    CadastradoPor: { nome: string; email: string; telefone: string | null; } | null;
    Categoria: { nome: string } | null;
    LocalEncontrado: { nome: string } | null;
    StatusAtual: { descricao: string } | null;
}

export default function ItemDetailPage() {
    const router = useRouter();
    const params = useParams();
    const idItem = params.id_item as string;

    const [item, setItem] = useState<ItemDetalhe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); 
    const [isOwner, setIsOwner] = useState(false); 

    useEffect(() => {
        if (!idItem) return;

        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('user');
        let currentUserId: number | null = null;

        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                currentUserId = user.id;
                setLoggedInUserId(currentUserId);
            } catch (e) {
                console.error("Erro ao parsear dados do usuário.");
            }
        }
        
        const fetchItem = async () => {
            try {
                const response = await api.get(`/itens/${idItem}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const itemData: ItemDetalhe = response.data;
                
        
                if (itemData.imagem && !itemData.imagem.startsWith('http')) {
                    itemData.imagem = `http://localhost:3001/uploads/${itemData.imagem}`;
                }

                setItem(itemData);

            
                if (currentUserId !== null && itemData.id_usuario_cadastrou === currentUserId) {
                    setIsOwner(true);
                }

            } catch (err: any) {
                setError(err.response?.data?.msg || "Item não encontrado ou erro ao carregar dados.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchItem();
    }, [idItem, router]); 




    const handleDelete = useCallback(async () => {
        if (!confirm("Tem certeza que deseja EXCLUIR este item? Esta ação é irreversível.")) {
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Sessão expirada. Faça login novamente.");
            return;
        }
        
        if (!isOwner) {
            alert("Acesso negado. Você não é o dono deste item.");
            return;
        }

        try {
            await api.delete(`/itens/${idItem}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert(`Item "${item?.titulo}" excluído com sucesso.`);
            router.push('/perfil'); 

        } catch (err: any) {
            console.error("Erro completo na API DELETE:", err);
            alert("Falha ao excluir item: " + (err.response?.data?.msg || "Erro de servidor."));
        }
    }, [idItem, isOwner, item, router]); 


    const handleEditRedirect = useCallback(() => {
        router.push(`/cadastro?itemId=${idItem}`); 
    }, [idItem, router]);


    if (isLoading) {
        return <main className="min-h-screen flex items-center justify-center p-4">Carregando detalhes do item...</main>;
    }

    if (error || !item) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 text-red-600">
                <p>{error || "Item não encontrado."}</p>
                <Link href="/" className="ml-4 text-blue-500 hover:underline">Voltar para a Vitrine</Link>
            </main>
        );
    }
    
    const formattedDate = new Date(item.data_encontrado).toLocaleDateString('pt-BR');
    const imageSource = item.imagem || '/default-item-placeholder.png'; 
    
    const dono = item.CadastradoPor;
    const nomeDono = dono?.nome || 'N/A';
    const emailDono = dono?.email || 'N/A';
    const telefoneDono = dono?.telefone || 'N/A';


    return (
        <main className="min-h-screen flex flex-col items-center p-4">
            <Head>
                <title>Detalhes do Item: {item.titulo}</title>
            </Head>
            <div 
                className="w-full max-w-4xl p-10 mt-10 rounded-2xl border-4 border-gray-700 shadow-2xl"
                style={{ backgroundColor: 'var(--form-background)' }}
            >
                <header className="flex items-center justify-between w-full mb-8">
                    <Link href="/" className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                        ← Voltar para a Vitrine
                    </Link>
                    <h1 className="text-4xl font-bold text-black bg-yellow-400 py-2 px-6 rounded-xl shadow-md">
                        {item.titulo}
                    </h1>
                    <div className="w-20"></div> 
                </header>
                
            
                {isOwner && (
                    <div className="flex justify-end space-x-3 mb-6">
                        <button
                            onClick={handleEditRedirect}
                            className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                            ✏️ Editar Item
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                        >
                            🗑️ Excluir Item
                        </button>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">Imagem do Item</h2>
                        <div className="relative w-full max-w-xs h-72 border-2 border-gray-400 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                                src={imageSource}
                                alt={item.titulo}
                                width={300}
                                height={300}
                                unoptimized
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                    
                    
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Detalhes</h2>
                        
                        <DetailRow label="Descrição Completa" value={item.descricao} />
                        <DetailRow label="Características" value={item.caracteristicas} />
                        <DetailRow label="Categoria" value={item.Categoria?.nome || 'N/A'} />
                        <DetailRow label="Status Atual" value={item.StatusAtual?.descricao || 'N/A'} />
                        <DetailRow label="Local Encontrado" value={item.LocalEncontrado?.nome || 'N/A'} />
                        <DetailRow label="Data Encontrada" value={formattedDate} />
                        
                        <div className="pt-4 border-t border-gray-300">
                            <h3 className="text-xl font-bold">Informações de Contato</h3>
                            <DetailRow label="Postado por" value={nomeDono} />
                            <DetailRow label="Email de Contato" value={emailDono} />
                            <DetailRow label="Telefone de Contato" value={telefoneDono} />
                        </div>
                        
                        
                        {!isOwner && (item.StatusAtual?.descricao === 'Ativo' || item.StatusAtual?.descricao === 'Pendente') && (
                            <button className="mt-6 w-full bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors">
                                Tenho Informações Sobre Este Item
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

const DetailRow: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
    <div className="p-3 bg-gray-100 rounded-md shadow-sm">
        <p className="font-semibold text-gray-800">{label}:</p>
        <p className="text-gray-600 whitespace-pre-wrap">{value || '---'}</p>
    </div>
);