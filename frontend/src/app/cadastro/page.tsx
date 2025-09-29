"use client";
import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [formData, setFormData] = useState({
    tipo: "",
    tipoNome: "",
    descricao: "",
    local: "",
    data: "",
    hora: "",
  });

  const [errors, setErrors] = useState<any>({});
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors: any = {};
    if (!formData.tipo) tempErrors.tipo = true;
    if (!formData.tipoNome) tempErrors.tipoNome = true;
    if (!formData.descricao) tempErrors.descricao = true;
    if (!formData.local) tempErrors.local = true;
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Formulário válido, enviando dados:", formData);
      alert("Cadastro finalizado com sucesso!");
    } else {
      console.log("Formulário inválido, corrija os erros.");
    }
  };

  return (
    <>
      <Head>
        <title>UTFPR - Cadastro de item</title>
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="w-full max-w-5xl p-10 rounded-2xl border-4 border-gray-700 flex flex-col items-center"
          style={{ backgroundColor: 'var(--form-background)' }}
        >
          
          <Image
            src="/utfpr-logo.png"
            alt="Logo UTFPR"
            width={250}
            height={250}
            className="mb-8"
          />

          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md mb-12"> 
            CADASTRO DE ITEM
          </h1>

          <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex justify-center gap-6 my-4">
                <label className="flex items-center gap-2 cursor-pointer radio-label-text">
                  <input type="radio" name="tipo" value="achado" onChange={handleChange} className="h-5 w-5" />
                  Achado
                </label>
                <label className="flex items-center gap-2 cursor-pointer radio-label-text">
                  <input type="radio" name="tipo" value="perdido" onChange={handleChange} className="h-5 w-5" />
                  Perdido
                </label>
              </div>
              {errors.tipo && <p className="error-message text-red-500 text-center -mt-3">✱ Campo obrigatório</p>}
              
              <div>
                <input
                  type="text"
                  name="tipoNome"
                  value={formData.tipoNome}
                  onChange={handleChange}
                  placeholder="Nome do item:"
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.tipoNome ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.tipoNome && <p className="error-message text-red-500">✱ Campo obrigatório</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descrição do item:"
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.descricao ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.descricao && <p className="error-message text-red-500">✱ Campo obrigatório</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  placeholder="Local onde foi achado/perdido:"
                  className={`w-full bg-white rounded-lg px-4 py-2 shadow-sm border ${errors.local ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.local && <p className="error-message text-red-500">✱ Campo obrigatório</p>}
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    aria-label="Data"
                    className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="w-full">
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    aria-label="Hora"
                    className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full mt-4 bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
              >
                Finalizar cadastro
              </button>
            </div>

            <div className="flex flex-col items-center justify-center pt-8">
              <p className="font-semibold text-gray-700 mb-2">
                Anexe uma imagem
              </p>
              <div className="w-60 h-60 bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 mb-4 overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Preview da imagem"
                    width={240}
                    height={240}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  "Nenhuma imagem"
                )}
              </div>
              <label
                htmlFor="file-upload"
                className="bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md"
              >
                Anexar imagem
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}