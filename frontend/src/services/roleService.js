import api from './api';

export const roleService = {
    getRoles: async () => {
        const response = await api.get('/roles/');
        return response.data;
    }
};