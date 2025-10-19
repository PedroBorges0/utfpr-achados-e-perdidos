// src/app/register/page.tsx (CORRIGIDO)
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api"; // Importa a instância da API
import { useRouter } from 'next/navigation'; // Importa o hook de navegação

export default function RegisterPage() {
    const router = useRouter(); // Hook para redirecionamento
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '', // Alterado de 'password' para 'senha' para corresponder ao Backend
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formData.senha !== formData.confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }
        
        setIsLoading(true);

        try {
            // Chamada para a rota de cadastro do Backend
            const response = await api.post('/usuarios/cadastro', {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha, // Enviando a senha
            });

            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            router.push('/login'); // Redireciona para a tela de login

        } catch (err: any) {
            const msg = err.response?.data?.msg || "Erro desconhecido ao cadastrar.";
            setError(msg);
            alert(`Falha no cadastro: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>UTFPR - Cadastro de Usuário</title>
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
                        CRIAR CONTA
                    </h1>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                        
                        {/* INPUTS - NOME, EMAIL, SENHA */}
                        {/* NOTE: NOME DOS CAMPOS ALTERADOS PARA 'senha' */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input id="nome" name="nome" type="text" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" name="email" type="email" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input id="senha" name="senha" type="password" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-bold text-yellow-600 hover:text-yellow-500">
                            Faça login
                        </Link>
                    </p>
                </div>
            </main>
        </>
    );
}