// Salve este código em: src/app/register/page.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // No futuro, aqui será a chamada para a API de cadastro
    console.log("Dados de Cadastro:", formData);
    alert("Cadastro realizado com sucesso! (Verifique o console F12)");
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
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input id="nome" name="nome" type="text" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" name="email" type="email" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <button type="submit" className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md">
              Cadastrar
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