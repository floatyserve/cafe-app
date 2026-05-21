import api from './axios';
import type { MenuItem, Category } from '../types';


export const menuService = {
    getMenu: async (category?: Category): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>('/menu', {
            params: {category}
        });
        return response.data;
    }
};
