const API_URL = "http://localhost:8000/usuarios";
const ROLES_URL = "http://localhost:8000/roles";

export const userService = {
    async getUsuarios() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al cargar los usuarios");
        return await response.json();
    },

    async getRoles() {
        const response = await fetch(ROLES_URL);
        if (!response.ok) throw new Error("Error al cargar los roles");
        return await response.json();
    },

    async createUsuario(userData) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Error al crear el usuario");
        return data;
    },
};