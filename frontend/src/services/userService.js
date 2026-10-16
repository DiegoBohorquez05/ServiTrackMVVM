const API_URL = "http://localhost:8000/usuarios"; // Ajusta según tu URL de backend

export const userService = {
    async getUsuarios() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener usuarios");
        return await response.json();
    },

    async getRoles() {
        const response = await fetch("http://localhost:8000/roles");
        if (!response.ok) throw new Error("Error al obtener roles");
        return await response.json();
    },

    async createUsuario(usuarioData) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Error al crear usuario");
        return data;
    },

    // Función para actualizar el rol de un usuario
    async updateUsuarioRol(usuarioId, newRolId) {
        const response = await fetch(`${API_URL}/${usuarioId}`, {
            method: "PUT", // o PATCH según tu router
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rol_id: Number(newRolId) }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Error al cambiar el rol del usuario");
        return data;
    },
};