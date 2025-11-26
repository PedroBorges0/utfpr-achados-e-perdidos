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
    telefone: "",
    senha: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------------
  // Atualiza campos
  // -----------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // -----------------------------------------
  // Validação dos campos
  // -----------------------------------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Nome
    if (!formData.nome.trim()) newErrors.nome = "*Campo obrigatório.";

    // Email
    if (!formData.email.trim()) newErrors.email = "*Campo obrigatório.";
    else if (!formData.email.includes("@") || !formData.email.includes("."))
      newErrors.email = "*E-mail inválido.";

    // Telefone obrigatório + validação de DDD Paraná
    if (!formData.telefone.trim()) {
      newErrors.telefone = "*Campo obrigatório.";
    } else {
      const regexTelefoneParana = /^\(?((41|42|43|44|45|46))\)?[\s-]?9\d{4}[-]?\d{4}$/;

      if (!regexTelefoneParana.test(formData.telefone)) {
        newErrors.telefone = "*Número inválido";
      }
    }

    // Senha
    if (!formData.senha.trim()) newErrors.senha = "*Campo obrigatório.";

    // Confirmação de senha
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "*Campo obrigatório.";
    else if (formData.senha !== formData.confirmPassword)
      newErrors.confirmPassword = "*As senhas não coincidem.";

    return newErrors;
  };

  // -----------------------------------------
  // Submissão do formulário
  // -----------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/usuarios/cadastro", {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
      });

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.msg || "Erro ao cadastrar usuário.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------
  // Renderização
  // -----------------------------------------
  return (
    <>
      <Head>
        <title>UTFPR - Cadastro de Usuário</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4 bg-yellow-400">
        <div className="w-full max-w-lg p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center bg-white shadow-2xl">
          
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

          {/* FORMULÁRIO */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full flex flex-col gap-4"
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.nome ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Telefone (obrigatório) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone 
              </label>
              <input
                name="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="XX 9XXXX-XXXX"
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.telefone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.senha ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {/* Link login */}
          <p className="mt-6 text-center text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-bold text-yellow-600 hover:text-yellow-500"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}