"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import api from '@/services/api';

import ItemCard from '@/components/ItemCard';

type UserProfile = {
    id_usuario: number;
    nome: string;
    email: string;
    telefone: string | null;
    avatar_url: string | null;
    tipo: string;
};

interface FormDataState {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    confirmarSenha: string;
}

const AVATAR_BASE_URL = 'http://localhost:4000/uploads';

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

    const updateLocalStorage = (updatedUser: UserProfile) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('username', updatedUser.nome.split(' ')[0]);
        setUser(updatedUser);
        setIsEditing(false);
        setFile(null);
        setPreviewImage(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
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
                console.error("Erro ao buscar perfil:", err);
                if (err.response?.status === 401) {
                    alert("Sessão expirada. Faça login novamente.");
                    localStorage.clear();
                    router.push('/login');
                } else {
                    setError("Erro ao carregar o perfil.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

        const alteringPassword = formData.senha.length > 0 || formData.confirmarSenha.length > 0;

        if (alteringPassword) {
            if (formData.senha !== formData.confirmarSenha) {
                setError("As senhas não coincidem.");
                return;
            }
            if (formData.senha.length < 6) {
                setError("A senha deve ter ao menos 6 caracteres.");
                return;
            }
        }

        setIsLoading(true);

        try {
            const data = new FormData();

            data.append('nome', formData.nome);
            data.append('email', formData.email);
            data.append('telefone', formData.telefone);

            if (formData.senha) data.append('senha', formData.senha);
            if (file) data.append('avatar', file);

            const response = await api.put('/usuarios/me', data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Perfil atualizado com sucesso!");
            updateLocalStorage(response.data.usuario);

        } catch (err: any) {
            const msg = err.response?.data?.msg || "Erro ao atualizar o perfil.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <main className="min-h-screen flex items-center justify-center">Carregando...</main>;
    }

    if (error || !user) {
        return (
            <main className="min-h-screen flex items-center justify-center text-red-600">
                {error || "Erro ao carregar perfil."}
            </main>
        );
    }

    const avatarSrc = previewImage || (user?.avatar_url ? AVATAR_BASE_URL + user.avatar_url : '/default-avatar.png');

    return (
        <main className="min-h-screen flex flex-col items-center p-4">
            <Head><title>Meu Perfil – {user.nome}</title></Head>

            <div className="w-full max-w-7xl p-10 mt-10 rounded-2xl border-4 border-gray-700 shadow-2xl bg-white">
                <header className="flex items-center justify-between mb-10">
                    <Link href="/" className="text-lg font-semibold hover:underline">← Voltar</Link>
                    <h1 className="text-4xl font-bold bg-yellow-400 py-2 px-6 rounded-xl">MEU PERFIL</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                    >
                        {isEditing ? "Cancelar" : "Editar"}
                    </button>
                </header>

                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-xl border-2">
                        <Image
                            src={avatarSrc}
                            alt="Avatar"
                            width={150}
                            height={150}
                            className="rounded-full border"
                            unoptimized
                        />

                        {isEditing && (
                            <label className="mt-4 bg-yellow-400 px-4 py-2 rounded-full cursor-pointer">
                                Escolher Avatar
                                <input type="file" className="hidden" onChange={handleImageChange} />
                            </label>
                        )}

                        <DetailRow label="ID Usuário" value={String(user.id_usuario)} />
                        <DetailRow label="Tipo" value={user.tipo} />
                    </div>

                    
                    <div className="md:col-span-2 bg-gray-100 p-6 rounded-xl border-2 space-y-4">
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

                        {isEditing && (
                            <>
                                <h3 className="text-xl font-bold pt-4">Alterar Senha</h3>

                                <InputGroup
                                    label="Nova Senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    type="password"
                                    placeholder="Deixe em branco para manter"
                                />

                                <InputGroup
                                    label="Confirmar Senha"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    type="password"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-400 font-bold py-3 rounded-full"
                                >
                                    Salvar Alterações
                                </button>
                            </>
                        )}
                    </div>

                
                    <div className="md:col-span-3 bg-white p-6 rounded-xl border-2 mt-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Meus Itens Postados</h2>

                        {userItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {userItems.map((item: any) => (
                                    <ItemCard key={item.id_item} item={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">Nenhum item postado ainda.</p>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}

const DetailRow: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
    <div className="p-3 bg-white rounded-md shadow-sm w-full">
        <p className="font-semibold">{label}</p>
        <p className="text-gray-600">{value || "---"}</p>
    </div>
);

const InputGroup: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?: boolean;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
}> = ({ label, name, value, onChange, disabled = false, type = 'text', placeholder = '', autocomplete = '' }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className="w-full rounded-lg px-4 py-2 border shadow-sm disabled:bg-gray-200"
        />
    </div>
);