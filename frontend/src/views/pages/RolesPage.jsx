import React from 'react';
import { useRolesViewModel } from '../../viewmodels/useRolesViewModel';

export const RolesPage = () => {
    // Consumimos el ViewModel
    const { roles, loading, error } = useRolesViewModel();

    if (loading) {
        return <div className="loading-container">Cargando roles desde Supabase...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="roles-container">
            <h1>Gestión de Roles (ServiTrack)</h1>
            <p>Lista de roles obtenidos a través del backend en FastAPI.</p>

            <table className="roles-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre del Rol</th>
                    <th>Descripción</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((rol) => (
                    <tr key={rol.id}>
                        <td>{rol.id}</td>
                        <td><strong>{rol.nombre}</strong></td>
                        <td>{rol.descripcion || 'Sin descripción'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};