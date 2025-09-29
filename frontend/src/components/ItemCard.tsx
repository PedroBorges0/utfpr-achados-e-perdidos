// src/components/ItemCard.tsx
import Image from 'next/image';

type ItemProps = {
  item: {
    nome: string;
    imagem: string;
    status: 'Achado' | 'Perdido';
    descricao: string;
    local: string;
    data: string;
    horario: string;
  }
};

export default function ItemCard({ item }: ItemProps) {
  return (
    // ADICIONADO borda para combinar com o formulário (border-4 border-gray-700)
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-4 border-gray-700">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{item.nome}</h3>
        <div className="relative w-full h-40 mb-4">
          <Image
            src={item.imagem}
            alt={item.nome}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-semibold">Status:</span> {item.status}</p>
          <p><span className="font-semibold">Descrição:</span> {item.descricao}</p>
          <p><span className="font-semibold">Local:</span> {item.local}</p>
          <p><span className="font-semibold">Data:</span> {item.data}</p>
          <p><span className="font-semibold">Horário:</span> {item.horario}</p>
        </div>
      </div>
    </div>
  );
}