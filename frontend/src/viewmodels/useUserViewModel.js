import { useState, useEffect } from "react";
import { userService } from "../services/userService";

export const useUserViewModel = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form state
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                userService.getUsuarios(),
                userService.getRoles(),
            ]);
            setUsuarios(usersData);
            setRoles(rolesData);
            if (rolesData.length > 0) setRolId(rolesData[0].id);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            await userService.createUsuario({
                nombre,
                correo,
                password,
                rol_id: Number(rolId),
                activo: true,
            });

            setSuccessMessage("¡Usuario creado exitosamente!");
            setNombre("");
            setCorreo("");
            setPassword("");
            fetchData(); // Recargar lista
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        usuarios,
        roles,
        loading,
        error,
        successMessage,
        nombre,
        setNombre,
        correo,
        setCorreo,
        password,
        setPassword,
        rolId,
        setRolId,
        handleCreateUser,
    };
};