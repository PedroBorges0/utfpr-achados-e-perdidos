// src/app/login/page.tsx (CORRIGIDO)
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api"; // Importa a instância da API
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); // Alterado de 'password' para 'senha'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Chamada para a rota de login do Backend
            const response = await api.post('/usuarios/login', {
                email: email,
                senha: senha,
            });

            const { token, usuario } = response.data;

            // 1. Armazena o Token JWT no armazenamento local (localStorage)
            localStorage.setItem('authToken', token);
            // 2. Armazena dados básicos do usuário (opcional, mas útil)
            localStorage.setItem('user', JSON.stringify(usuario));

            alert(`Bem-vindo, ${usuario.nome}! Login bem-sucedido.`);
            router.push('/'); // Redireciona para a página principal (Vitrine)

        } catch (err: any) {
            const msg = err.response?.data?.msg || "Erro desconhecido. Credenciais inválidas.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>UTFPR - Login</title>
            </Head>
            <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
                <div 
                    className="w-full max-w-lg p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center"
                    style={{ backgroundColor: 'var(--form-background)' }}
                >
                    <Image
                        src="/utfpr-logo.png"
                        alt="Logo UTFPR"
                        width={200}
                        height={200}
                        className="mb-6"
                    />
                    <h1 className="text-4xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md mb-8">
                        LOGIN
                    </h1>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input
                                id="senha"
                                name="senha" // Alterado de 'password' para 'senha'
                                type="password"
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Ainda não tem uma conta?{' '}
                        <Link href="/register" className="font-bold text-yellow-600 hover:text-yellow-500">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </main>
        </>
    );
}