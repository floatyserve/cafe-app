import api from './axios';
import type { Table } from '../types';


export const tableService = {
    getAllTables: async (): Promise<Table[]> => {
        const response = await api.get<Table[]>('/tables');
        return response.data;
    },

    markAsOutOfOrder: async (id: number): Promise<Table> => {
        const response = await api.patch<Table>(`/tables/${id}/out-of-order`);
        return response.data;
    },

    markAsActive: async (id: number): Promise<Table> => {
        const response = await api.patch<Table>(`/tables/${id}/active`);
        return response.data;
    }
};
