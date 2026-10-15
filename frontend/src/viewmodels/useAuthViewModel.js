import { useState } from "react";
import { authService } from "../services/authService";

export const useAuthViewModel = (onLoginSuccess) => {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await authService.login(correo, password);

            // Guardar sesión en localStorage
            localStorage.setItem("user", JSON.stringify(data.usuario));

            if (onLoginSuccess) {
                onLoginSuccess(data.usuario);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        correo,
        setCorreo,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    };
};