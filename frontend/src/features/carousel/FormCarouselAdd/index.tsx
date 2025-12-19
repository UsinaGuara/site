import React, { useState } from 'react';
import { useCarouselForm } from '../useCarouselForm';
import type { CarouselResponseType, CollectionType } from '../carousel.types';

// --- Componente de Linha (Itens Inativos) ---
const InactiveItemRow: React.FC<{
    item: CarouselResponseType,
    handleActivate: (item: CarouselResponseType) => Promise<{ success: boolean, message: string }>,
    isSaving: boolean,
}> = ({ item, handleActivate, isSaving }) => {

    const [rowFeedback, setRowFeedback] = useState('');
    const [isActivating, setIsActivating] = useState(false);

    const activateItem = async () => {
        setIsActivating(true);
        setRowFeedback('Adicionando...');

        const result = await handleActivate(item);

        setRowFeedback(result.message);
        setIsActivating(false);

        setTimeout(() => setRowFeedback(''), 4000);
    };

    const typeColor = item.collection_type === 'project' ? 'text-orange-400' : 'text-purple-400';
    const buttonContent = isActivating ? 'Ativando...' : (rowFeedback || 'Adicionar ao Carrossel');
    const feedbackStyle = rowFeedback.includes('Erro') ? 'text-red-400' : 'text-green-400';

    return (
        <tr className="border-b border-gray-500 hover:bg-gray-800">
            <td className="px-6 py-3 font-medium text-gray-200">
                {item.title}
                <span className={`ml-2 text-xs font-semibold ${typeColor}`}>
                    [{item.collection_type.toUpperCase()}]
                </span>
            </td>
            <td className="px-6 py-3 text-center">
                <button
                    onClick={activateItem}
                    disabled={isSaving || isActivating}
                    className={`px-4 py-1 rounded text-white text-sm font-bold transition-colors 
                       ${isSaving || isActivating
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-red-700 hover:bg-red-500'} `}
                >
                    {buttonContent}
                </button>
                {rowFeedback && !isActivating && (
                    <p className={`mt-1 text-xs ${feedbackStyle}`}>{rowFeedback}</p>
                )}
            </td>
        </tr>
    );
};

export const FormCarouselAdd: React.FC = () => {
    const { state, actions } = useCarouselForm();
    const { isLoading, error, inactiveItems, isSaving } = state;
    const { handleActivateItem } = actions;
    const [page, setPage] = useState(1);
    const limit = 5;

    const totalPages = Math.ceil(inactiveItems.length / limit);
    const start = (page - 1) * limit;
    const paginatedItems = inactiveItems.slice(start, start + limit);


    const activateItemWrapper = (item: CarouselResponseType) => {
        return actions.handleActivateItem(item.collection_type as CollectionType, item._id);
    };


    if (isLoading) {
        return <div className="text-center py-8 text-gray-400">Buscando itens para adicionar...</div>;
    }

    if (error) {
        return (
            <div className="p-6 bg- bg-gray-800 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Adicionar Destaques</h2>
                <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded relative">
                    Erro: {error}. Verifique a API.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">Adicionar Destaques (Itens Inativos)</h2>

            {inactiveItems.length === 0 ? (
                <p className="text-gray-400 p-4 border border-gray-600 rounded">
                    Todos os itens elegíveis já estão como candidatos ao carrossel.
                </p>
            ) : (
                <div className="overflow-x-auto relative border border-gray-600 rounded-lg">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-200 uppercase bg-gray-600">
                            <tr>
                                <th className="py-2 px-4">Item (Inativo)</th>
                                <th className="py-2 px-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map(item => (
                                <InactiveItemRow
                                    key={item._id}
                                    item={item}
                                    handleActivate={activateItemWrapper}
                                    isSaving={isSaving}
                                />
                            ))}
                        </tbody>
                    </table>

                </div>

            )}
            {/* PAGINAÇÃO */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                <span className="text-gray-400">
                    Página {page} de {totalPages}
                </span>

                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>

        </div>

    );
};