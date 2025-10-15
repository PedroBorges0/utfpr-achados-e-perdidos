// Salve este código em: src/app/login/page.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function LoginPage() {
  // Estados para controlar os valores dos inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, apenas exibimos os dados no console
    // No futuro, aqui será a chamada para a API de login
    console.log("Dados de Login:", { email, password });
    alert("Tentativa de login realizada! Verifique o console (F12).");
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
            >
              Entrar
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