"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";

const mockItens = [
  { id: 1, nome: "Caneta Tinteiro", imagem: "/caneta.png", status: "Achado", descricao: "Caneta preta com detalhes dourados.", local: "Biblioteca", data: "28/09/2025", horario: "15:30" },
  { id: 2, nome: "Guarda-chuva", imagem: "/guarda-chuva.png", status: "Perdido", descricao: "Guarda-chuva roxo, pequeno.", local: "Bloco B", data: "27/09/2025", horario: "10:00" },
  { id: 3, nome: "Boné Azul", imagem: "/bone.png", status: "Achado", descricao: "Boné de beisebol, azul claro.", local: "Cantina", data: "29/09/2025", horario: "12:45" },
  { id: 4, nome: "Óculos de Grau", imagem: "/oculos.png", status: "Perdido", descricao: "Armação preta, modelo retangular.", local: "Estacionamento", data: "26/09/2025", horario: "18:00" },
  { id: 5, nome: "Caneta Tinteiro", imagem: "/caneta.png", status: "Achado", descricao: "Caneta preta com detalhes dourados.", local: "Biblioteca", data: "28/09/2025", horario: "15:30" },
  { id: 6, nome: "Guarda-chuva", imagem: "/guarda-chuva.png", status: "Perdido", descricao: "Guarda-chuva roxo, pequeno.", local: "Bloco B", data: "27/09/2025", horario: "10:00" },
  { id: 7, nome: "Boné Azul", imagem: "/bone.png", status: "Achado", descricao: "Boné de beisebol, azul claro.", local: "Cantina", data: "29/09/2025", horario: "12:45" },
  { id: 8, nome: "Óculos de Grau", imagem: "/oculos.png", status: "Perdido", descricao: "Armação preta, modelo retangular.", local: "Estacionamento", data: "26/09/2025", horario: "18:00" },
] as const;

export default function Vitrine() {
  const [items, setItems] = useState<typeof mockItens>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = () => { // A palavra 'async' não é mais necessária
      try {
        // A LINHA QUE CAUSAVA A ESPERA DE 2 SEGUNDOS FOI REMOVIDA DAQUI
        setItems(mockItens);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      // Esta mensagem pode aparecer por um instante muito rápido ou nem ser visível
      return <p className="text-center text-xl font-semibold">Carregando itens...</p>;
    }

    if (error) {
      return <p className="text-center text-xl font-semibold text-red-500">Erro ao carregar os itens: {error}</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div 
        className="w-full max-w-7xl p-10 rounded-2xl border-4 border-gray-700 shadow-2xl"
        style={{ backgroundColor: 'var(--form-background)' }}
      >
        <header className="flex items-center justify-between w-full mb-12">
          <Image src="/utfpr-logo.png" alt="Logo UTFPR" width={200} height={200} />
          <h1 className="text-5xl font-bold text-black bg-yellow-400 py-3 px-10 rounded-xl shadow-md">
            ACHADOS E PERDIDOS
          </h1>
          <Link href="/login" className="bg-gray-800 text-white font-bold text-md px-8 py-3 rounded-full shadow-lg hover:bg-black transition-colors">
            Login
          </Link>
        </header>
        
        {renderContent()}
      </div>
      
      <div className="fixed bottom-8 right-8">
        <Link 
          href="/cadastro" 
          className="bg-yellow-400 text-yellow-900 font-bold text-lg px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
        >
          Cadastrar um item
        </Link>
      </div>
    </main>
  );
}