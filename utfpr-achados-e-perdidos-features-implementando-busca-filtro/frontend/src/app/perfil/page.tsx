// src/app/perfil/page.tsx (VERSÃO FINAL E FUNCIONAL)
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import api from '@/services/api';

// --- IMPORTAÇÕES DE COMPONENTES AUXILIARES ---
import ItemCard from '@/components/ItemCard'; // Importação explícita do ItemCard
// Não precisamos do import { DetailRow, InputGroup } se estiverem no final do arquivo.
// ----------------------------------------------


// Definição do Tipo do Usuário com Avatar
type UserProfile = {
    id_usuario: number;
    nome: string;
    email: string;
    telefone: string | null;
    avatar_url: string | null; 
    tipo: string;
};

// Dados necessários para a requisição PUT
interface FormDataState {
    nome: string; email: string; telefone: string; senha: string; confirmarSenha: string; 
}

// URL BASE para carregar o avatar salvo no Backend (ajuste a porta se necessário)
// src/app/perfil/page.tsx

// A URL BASE CORRETA deve incluir a subpasta 'avatares/'
const AVATAR_BASE_URL = 'http://localhost:4000/uploads';
// Se esta URL estiver correta, o problema é puramente no passo 1.

// ====================================================================
// COMPONENTE PRINCIPAL
// ====================================================================

export default function PerfilPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userItems, setUserItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormDataState>({
        nome: '', email: '', telefone: '', senha: '', confirmarSenha: '', 
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // --- FUNÇÕES ÚTEIS ---
    const updateLocalStorage = (updatedUser: UserProfile) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('username', updatedUser.nome.split(' ')[0]);
        setUser(updatedUser);
        setIsEditing(false); 
        setFile(null); 
        setPreviewImage(null);
    };

    // --- BUSCAR DADOS DO USUÁRIO E ITENS ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUserProfileAndItems = async () => {
            setIsLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [userResponse, itemsResponse] = await Promise.all([
                    api.get('/usuarios/me', config), 
                    api.get('/itens/meus-itens', config)
                ]);

                const userData: UserProfile = userResponse.data;

                setUser(userData);
                setUserItems(itemsResponse.data);
                
                setFormData({
                    nome: userData.nome || '',
                    email: userData.email || '',
                    telefone: userData.telefone || '',
                    senha: '', 
                    confirmarSenha: '', 
                });

            } catch (err: any) {
                console.error("Erro ao buscar perfil ou itens:", err);
                if (err.response?.status === 401) {
                    alert("Sessão expirada. Faça login novamente.");
                    localStorage.clear();
                    router.push('/login');
                } else {
                    setError("Não foi possível carregar o perfil. Erro de servidor.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfileAndItems();
    }, [router]);
    
    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const token = localStorage.getItem('authToken');
        if (!token) return router.push('/login');

        const attemptingPasswordChange = formData.senha.length > 0 || formData.confirmarSenha.length > 0;
        
        if (attemptingPasswordChange) {
            if (formData.senha !== formData.confirmarSenha) {
                setError("As senhas não coincidem.");
                return;
            }
            if (formData.senha.length < 6) { 
                setError("A senha deve ter no mínimo 6 caracteres.");
                return;
            }
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            
            // 1. ANEXA DADOS DE TEXTO
            data.append('nome', formData.nome);
            data.append('email', formData.email);
            data.append('telefone', formData.telefone);

            // 2. ANEXA NOVA SENHA (SÓ SE FOI PREENCHIDA)
            if (formData.senha) {
                data.append('senha', formData.senha);
            }
            
            // 3. ANEXA O AVATAR
            if (file) {
                data.append('avatar', file); 
            }
            
            // CHAMA A ROTA PUT /api/usuarios/me
            const response = await api.put('/usuarios/me', data, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                },
            });

            alert('Perfil atualizado com sucesso!');
            updateLocalStorage(response.data.usuario); 

        } catch (err: any) {
            const msg = err.response?.data?.msg || "Erro desconhecido. Verifique se o campo 'email' não está duplicado.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };


    // --- RENDERIZAÇÃO ---
    if (isLoading) {
        return <main className="min-h-screen flex items-center justify-center p-4">Carregando perfil...</main>;
    }

    if (error || !user) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 text-red-600">
                <p>{error || "Perfil não encontrado. Erro de carregamento."}</p>
                <Link href="/login" className="ml-4 text-blue-500 hover:underline">Ir para Login</Link>
            </main>
        );
    }
    
    // Define a imagem a ser exibida: 1. Preview; 2. URL salva; 3. Default
    const avatarSrc = previewImage || (user?.avatar_url ? AVATAR_BASE_URL + user.avatar_url : '/default-avatar.png');

    return (
        <main className="min-h-screen flex flex-col items-center p-4">
            <Head>
                <title>Meu Perfil - {user.nome}</title>
            </Head>
            <div 
                className="w-full max-w-7xl p-10 mt-10 rounded-2xl border-4 border-gray-700 shadow-2xl relative"
                style={{ backgroundColor: 'var(--form-background)' }}
            >
                <header className="flex items-center justify-between w-full mb-8">
                    <Link href="/" className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                        ← Voltar para a Vitrine
                    </Link>
                    <h1 className="text-4xl font-bold text-black bg-yellow-400 py-2 px-6 rounded-xl shadow-md">
                        MEU PERFIL
                    </h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                    >
                        {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
                    </button>
                </header>

                <form onSubmit={handleEditSubmit} className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {/* Coluna 1: Avatar e Dados Básicos */}
                    <div className="col-span-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-4 border-gray-700 flex flex-col items-center">
                        
                        <Image
                            src={avatarSrc}
                            alt="Avatar do Usuário"
                            width={150}
                            height={150}
                            className="rounded-full mb-4 border-4 border-gray-400 object-cover"
                            unoptimized
                        />
                        
                        {isEditing && (
                            <label htmlFor="avatar-upload" className="mb-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors">
                                Escolher Avatar
                                <input type="file" id="avatar-upload" name="avatar" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        )}

                        <DetailRow label="ID de Usuário" value={user.id_usuario.toString()} staticDisplay={true} />
                        <DetailRow label="Tipo de Usuário" value={user.tipo || 'aluno'} staticDisplay={true} />
                    </div>

                    {/* Coluna 2: Formulário de Edição */}
                    <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-4 border-gray-700 space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Informações de Contato</h2>
                        
                        {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

                        <InputGroup 
                            label="Nome Completo" 
                            name="nome" 
                            value={isEditing ? formData.nome : user.nome} 
                            onChange={handleChange} 
                            disabled={!isEditing} 
                        />
                        <InputGroup 
                            label="Email" 
                            name="email" 
                            value={isEditing ? formData.email : user.email} 
                            onChange={handleChange} 
                            disabled={!isEditing} 
                            type="email"
                        />
                        <InputGroup 
                            label="Telefone" 
                            name="telefone" 
                            value={isEditing ? formData.telefone : user.telefone || ''} 
                            onChange={handleChange} 
                            disabled={!isEditing} 
                        />
                        
                        {/* Campos de Senha (Visível apenas em modo de edição) */}
                        {isEditing && (
                            <>
                                <h3 className="text-xl font-bold pt-4 border-t border-gray-300">Alterar Senha</h3>
                                <InputGroup 
                                    label="Nova Senha" 
                                    name="senha" 
                                    value={formData.senha} 
                                    onChange={handleChange} 
                                    type="password"
                                    placeholder="Deixe em branco para manter a senha atual"
                                    autocomplete="new-password"
                                />
                                <InputGroup 
                                    label="Confirmar Senha" 
                                    name="confirmarSenha" 
                                    value={formData.confirmarSenha} 
                                    onChange={handleChange} 
                                    type="password"
                                    autocomplete="new-password"
                                />
                            </>
                        )}
                        
                        {/* Botão de Salvar (Aparece apenas em modo de edição) */}
                        {isEditing && (
                            <button
                                type="submit"
                                className="w-full mt-6 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-500 transition-colors shadow-md"
                                disabled={isLoading}
                            >
                                Salvar Alterações
                            </button>
                        )}
                    </div>

                    {/* Coluna 3: Itens Postados pelo Usuário */}
                    <div className="col-span-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-4 border-gray-700 mt-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meus Itens Postados</h2>
                        {userItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {userItems.map((item: any) => (
                                    <ItemCard key={item.id_item} item={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center text-xl">Você ainda não postou nenhum item.</p>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}

// Componente auxiliar para exibir dados não editáveis
const DetailRow: React.FC<{ label: string; value: string | null; staticDisplay?: boolean }> = ({ label, value, staticDisplay }) => (
    <div className="p-3 bg-gray-100 rounded-md shadow-sm">
        <p className="font-semibold text-gray-800">{label}:</p>
        <p className="text-gray-600 whitespace-pre-wrap">{value || '---'}</p>
    </div>
);

// Componente para inputs editáveis/visuais
const InputGroup: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; disabled: boolean; type?: string; placeholder?: string; autocomplete?: string }> = ({ label, name, value, onChange, disabled, type = 'text', placeholder = '', autocomplete = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autocomplete={autocomplete}
            className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
    </div>
);