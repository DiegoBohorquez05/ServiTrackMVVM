const API_URL = "http://localhost:8000/usuarios";

export const authService = {
    async login(correo, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Error al iniciar sesión");
        }

        return data;
    },
};