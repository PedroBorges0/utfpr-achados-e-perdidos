// src/app/register/page.tsx — versão final corrigida e validada
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- Atualiza campos ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- Validação simples ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) newErrors.nome = "*Campo obrigatório.";
    if (!formData.email.trim()) newErrors.email = "*Campo obrigatório.";
    else if (!formData.email.includes("@") || !formData.email.includes("."))
      newErrors.email = "*E-mail inválido.";

    if (!formData.senha.trim()) newErrors.senha = "*Campo obrigatório.";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "*Campo obrigatório.";
    else if (formData.senha !== formData.confirmPassword)
      newErrors.confirmPassword = "*As senhas não coincidem.";

    return newErrors;
  };

  // --- Envio do formulário ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/usuarios/cadastro", {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });

      alert(response.data.msg || "✅ Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.msg || "Erro desconhecido ao cadastrar.";
      alert(`❌ Falha no cadastro: ${msg}`);
      console.error("Erro ao cadastrar usuário:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderização ---
  return (
    <>
      <Head>
        <title>UTFPR - Cadastro de Usuário</title>
      </Head>
      <main
        className="min-h-screen flex items-center justify-center p-4 bg-yellow-400"
      >
        <div
          className="w-full max-w-lg p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center bg-white shadow-2xl"
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

          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full flex flex-col gap-4"
          >
            {/* NOME */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                onChange={handleChange}
                value={formData.nome}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.nome ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* SENHA */}
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                onChange={handleChange}
                value={formData.senha}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.senha ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                value={formData.confirmPassword}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-bold text-yellow-600 hover:text-yellow-500"
            >
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}