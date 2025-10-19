// src/components/ItemCard.tsx (CÓDIGO COMPLETO E FINAL)
import Image from 'next/image';

// Definição do Tipo de Propriedades REAL da API (Baseado no seu GET /api/itens)
// Garante que o componente saiba ler os dados aninhados (StatusAtual, LocalEncontrado)
type ItemAPI = {
    id_item: number;
    titulo: string; 
    descricao: string;
    imagem: string | null; // Pode ser a URL da imagem ou null
    data_encontrado: string;
    
    // Propriedades vindas dos JOINs (Relacionamentos)
    StatusAtual: { descricao: string } | null; 
    LocalEncontrado: { nome: string } | null;
};

type ItemProps = {
    item: ItemAPI;
};

export default function ItemCard({ item }: ItemProps) {
    // Mapeamento e Formatação dos Dados
    // Usa optional chaining (?) para evitar erros se o relacionamento vier nulo
    const statusText = item.StatusAtual?.descricao || 'N/A';
    const localText = item.LocalEncontrado?.nome || 'N/A';
    
    // Formatação da Data (da API: YYYY-MM-DD para PT-BR: DD/MM/AAAA)
    let formattedDate = 'N/A';
    if (item.data_encontrado) {
        try {
            // A API retorna YYYY-MM-DD. O construtor Date aceita isso.
            const dateObj = new Date(item.data_encontrado);
            formattedDate = dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            formattedDate = 'Data Inválida';
        }
    }
    
    const horarioText = '--'; // Placeholder, pois não está no BD

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-4 border-gray-700">
            <div className="p-4">
                {/* O nome do item agora é 'titulo' */}

                <h3 className="font-bold text-lg mb-2">{item.titulo}</h3> 
                
                {/* Bloco de Imagem Corrigido */}
                <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                    <Image
                        // src: Usa a imagem do item ou o placeholder
                        src={item.imagem || "https://via.placeholder.com/150"} 
                        alt={item.titulo}
                        width={150} // Dimensão fixa para renderização garantida
                        height={150} // Dimensão fixa para renderização garantida
                        unoptimized // Adicionado para forçar a renderização sem otimização do Next.js
                        style={{ objectFit: 'contain' }} 
                    />
                </div>                
                
                <div className="text-sm text-gray-700 space-y-1">
                    {/* Campos corrigidos para a estrutura aninhada da API */}
                    <p><span className="font-semibold">Status:</span> {statusText}</p> 
                    <p><span className="font-semibold">Descrição:</span> {item.descricao}</p>
                    <p><span className="font-semibold">Local:</span> {localText}</p>
                    <p><span className="font-semibold">Data:</span> {formattedDate}</p>
                    <p><span className="font-semibold">Horário:</span> {horarioText}</p>
                </div>
            </div>
        </div>
    );
}