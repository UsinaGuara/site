// src/services/carousel.service.ts

import api from "../../lib/api"; // Assumindo que seu Axios está em src/lib/api
import type { CarouselResponseType, PaginatedCarouselResponse } from "./carousel.types"; 

/**
 * @class CarouselService
 * @description Lida com a busca e gestão da lista centralizada de destaques do carrossel.
 */
export class CarouselService {

    /**
     * Busca a lista unificada e ordenada de Projetos e Perspectivas para o carrossel.
     * @returns {Promise<CarouselResponseType[]>} 
     */
    static async getAllCarouselPaginated(
        page = 1,
        limit = 5
    ): Promise<PaginatedCarouselResponse> {
        try {
            const response = await api.get<PaginatedCarouselResponse>(
                "/carousel/page",
                {
                    params: { page, limit },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error fetching paginated carousel data:", error);
            throw new Error("Failed to load paginated carousel items from API.");
        }
    }

    static async getAllCarouselOrder(): Promise<CarouselResponseType[]> {
        try {
            const response = await api.get<CarouselResponseType[]>('/carousel');
            return response.data;
        } catch (error) {
            console.error("Error fetching carousel data:", error);
            throw new Error("Failed to load carousel items from API.");
        }
    }

    static async getAllInactiveCarouselItems(): Promise<CarouselResponseType[]> {
        try {
            const response = await api.get<CarouselResponseType[]>('/carousel/inactive'); 
            return response.data;
        } catch (error) {
            console.error("Error fetching inactive carousel data:", error);
            throw new Error("Failed to load inactive carousel items from API.");
        }
    }
}