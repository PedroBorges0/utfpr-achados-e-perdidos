"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de validação individual
  const [emailError, setEmailError] = useState<string | null>(null);
  const [senhaError, setSenhaError] = useState<string | null>(null);

  // Função para validar email
  const validarEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setSenhaError(null);

    let hasError = false;

    // Validação dos campos
    if (!email) {
      setEmailError("*Campo obrigatório");
      hasError = true;
    } else if (!validarEmail(email)) {
      setEmailError("*E-mail inválido");
      hasError = true;
    }

    if (!senha) {
      setSenhaError("*Campo obrigatório");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // Chamada para o backend
      const response = await api.post("/usuarios/login", {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      // Armazena dados do usuário
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      alert(`Bem-vindo, ${usuario.nome}! Login bem-sucedido.`);
      router.push("/"); // Redireciona para a página principal
    } catch (err: any) {
      // Se o backend retornar erro 404 ou similar
      const msg =
        err.response?.data?.msg === "Usuário não encontrado"
          ? "Usuário Inexistente"
          : "Usuário Inexistente";
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
      <main
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div
          className="w-full max-w-lg p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center"
          style={{ backgroundColor: "var(--form-background)" }}
        >
          <Image
            src="/utfpr-logo.png"
            alt="Logo UTFPR"
            width={200}
            height={200}
            className="mb-6"
          />
          <h1 className="text-4xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md mb-4">
            LOGIN
          </h1>

          {error && (
            <p className="text-red-500 text-center font-semibold mb-4">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full flex flex-col gap-4"
          >
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
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                } focus:outline-none focus:ring-2`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

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
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (senhaError) setSenhaError(null);
                }}
                className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${
                  senhaError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                } focus:outline-none focus:ring-2`}
              />
              {senhaError && (
                <p className="text-red-500 text-xs mt-1">{senhaError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Ainda não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-bold text-yellow-600 hover:text-yellow-500"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}