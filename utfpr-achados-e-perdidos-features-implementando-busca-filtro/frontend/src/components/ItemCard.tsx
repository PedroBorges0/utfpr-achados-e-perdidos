// src/components/ItemCard.tsx (CÓDIGO FINAL E LIMPO)
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Definição do Tipo de Propriedades REAL da API
type ItemAPI = {
    id_item: number;
    titulo: string; 
    descricao: string;
    imagem: string | null; 
    data_encontrado: string;
    StatusAtual: { descricao: string } | null; 
    LocalEncontrado: { nome: string } | null;
};

type ItemProps = {
    item: ItemAPI;
};

export default function ItemCard({ item }: ItemProps) {
    const statusText = item.StatusAtual?.descricao || 'N/A';
    const localText = item.LocalEncontrado?.nome || 'N/A';
    
    let formattedDate = 'N/A';
    if (item.data_encontrado) {
        try {
            const dateObj = new Date(item.data_encontrado);
            formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            formattedDate = 'Data Inválida';
        }
    }
    
    const horarioText = '--'; 

    return (
        <Link href={`/item/${item.id_item}`} passHref>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-4 border-gray-700 cursor-pointer">
                <div className="p-4">
                    

                    <h3 className="font-bold text-lg mb-2">{item.titulo}</h3> 
                    <div className="w-full h-40 mb-4 bg-gray-100 flex items-center justify-center">
                        <Image
                            // Final src: Usando o logo que comprovadamente existe na public/
                            src={item.imagem || "/utfpr-logo.png"} 
                            alt={item.titulo}
                            width={150} 
                            height={150} 
                            unoptimized 
                            style={{ objectFit: 'contain' }} 
                        />
                    </div> 

                    
                    
                    <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold">Status:</span> {statusText}</p> 
                        <p><span className="font-semibold">Descrição:</span> {item.descricao}</p>
                        <p><span className="font-semibold">Local:</span> {localText}</p>
                        <p><span className="font-semibold">Data:</span> {formattedDate}</p>
                        <p><span className="font-semibold">Horário:</span> {horarioText}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}