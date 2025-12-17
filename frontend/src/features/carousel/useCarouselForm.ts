// src/features/carousel/useCarouselForm.ts

import { useEffect, useState } from "react";
import type { CarouselResponseType } from "./carousel.types";
import type { ProjectRequestType } from "../projects/project.types";
import type { PerspectiveRequest } from "../perpectives/components/FormPerspective/perspective.types";
import { CarouselService } from "./carousel.service";
import { ProjectService } from "../projects/project.service";
import { PerspectiveService } from "../perpectives/components/perspective.service";


export function useCarouselForm() {
    const [highlightItems, setHighlightItems] = useState<CarouselResponseType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [inactiveItems, setInactiveItems] = useState<CarouselResponseType[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    // Função de busca (usada no useEffect e após o salvamento)
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {

            const paginated = await CarouselService.getAllCarouselPaginated(page, 5);

            setHighlightItems(
                paginated.items.sort(
                    (a, b) => (a.orderCarousel ?? Infinity) - (b.orderCarousel ?? Infinity)
                )
            );

            setTotalPages(paginated.meta.totalPages);

            const inactiveData = await CarouselService.getAllInactiveCarouselItems(); 
            setInactiveItems(inactiveData.sort((a, b) => a.title.localeCompare(b.title))); 
        } catch (err: any) {
            setError("Falha ao carregar destaques do carrossel. Verifique a API.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const updateItemField = (id: string, field: keyof CarouselResponseType, value: any) => {
        setHighlightItems(prev => prev.map(item =>
            item._id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSaveItem = async (item: CarouselResponseType): Promise<{ success: boolean, message: string }> => {
        setIsSaving(true); 

        const payload = {
            orderCarousel: item.orderCarousel || undefined,
            extraURL: item.extraURL || undefined,
        };
        try {
            if (item.collection_type === 'project') {
                await ProjectService.update(item._id, payload as Partial<ProjectRequestType>);
            } else if (item.collection_type === 'perspective') {
                await PerspectiveService.update(item._id, payload as Partial<PerspectiveRequest>);
            }

            await fetchData();

            setIsSaving(false);
            return { success: true, message: `"${item.title}" salvo com sucesso!` };

        } catch (err) {
            console.error(`Falha ao salvar ${item.title} (${item.collection_type}):`, err);
            setIsSaving(false);
            return { success: false, message: `Erro ao salvar "${item.title}".` };
        }
    };

    const handleActivateItem = async (type: 'project' | 'perspective', id: string) => {

        const maxOrder = highlightItems.reduce((max, item) =>
            (item.orderCarousel !== undefined && item.orderCarousel !== null && item.orderCarousel > max ? item.orderCarousel : max), -1);
        const newOrder = maxOrder + 1;

        const payload = {
            orderCarousel: newOrder,
            isCarousel: true,
        };

        try {
            if (type === 'project') {
                await ProjectService.update(id, payload as Partial<ProjectRequestType>);
            } else {
                await PerspectiveService.update(id, payload as Partial<PerspectiveRequest>);
            }

            await fetchData();
            return { success: true, message: "Item adicionado com sucesso!" };

        } catch (err) {
            return { success: false, message: "Erro ao adicionar item." };
        }
    };

    const handleDeactivateItem = async (item: CarouselResponseType): Promise<{ success: boolean, message: string }> => {
        setIsSaving(true);

        const payload = {
            isCarousel: false,
            orderCarousel: undefined,
            extraURL: undefined,
        };

        try {
            if (item.collection_type === 'project') {
                await ProjectService.update(item._id, payload as Partial<ProjectRequestType>);
            } else {
                await PerspectiveService.update(item._id, payload as Partial<PerspectiveRequest>);
            }

            await fetchData();

            setIsSaving(false);
            return { success: true, message: `"${item.title}" removido dos destaques!` };

        } catch (err) {
            console.error(`Falha ao desativar ${item.title}:`, err);
            setIsSaving(false);
            return { success: false, message: `Erro ao remover "${item.title}".` };
        }
    };
    return {

        state: {
            highlightItems,
            inactiveItems,
            isLoading,
            error,
            isSaving,
            page,
            totalPages,
        },
        actions: {
            handleSaveItem,
            updateItemField,
            handleActivateItem,
            handleDeactivateItem,
            setPage,
        },

    };
}