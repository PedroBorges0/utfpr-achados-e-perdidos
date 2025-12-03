import Image from "next/image";
import Link from "next/link";
import { ItemAPI } from "@/types/ItemAPI";

interface ItemCardProps {
    item: ItemAPI;
}

export default function ItemCard({ item }: ItemCardProps) {
    return (
        <Link
            href={`/item/${item.id_item}`}
            className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
            <div className="relative w-full h-48 bg-gray-200">
                <Image
                    src={item.imagem ? item.imagem : "/no-image.png"}
                    alt={item.titulo}
                    fill
                    className="object-cover"
                    sizes="100%"
                />
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold">{item.titulo}</h3>

                {item.Categoria?.nome && (
                    <p className="text-sm text-gray-600 mt-1">
                        Categoria: {item.Categoria.nome}
                    </p>
                )}

                {item.LocalEncontrado?.nome && (
                    <p className="text-sm text-gray-600">
                        Local: {item.LocalEncontrado.nome}
                    </p>
                )}

                {item.StatusAtual?.descricao && (
                    <span
                        className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded"
                        style={{
                            backgroundColor: item.StatusAtual.cor_hex || "#ccc",
                            color: "white",
                        }}
                    >
                        {item.StatusAtual.descricao}
                    </span>
                )}
            </div>
        </Link>
    );
}