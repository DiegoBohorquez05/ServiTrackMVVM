import { useState, useEffect } from 'react';
import { roleService } from '../services/roleService';

export const useRolesViewModel = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const data = await roleService.getRoles();
                setRoles(data);
            } catch (err) {
                setError('Error al cargar los roles desde el servidor');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return {
        roles,
        loading,
        error
    };
};