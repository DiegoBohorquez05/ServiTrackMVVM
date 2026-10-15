import React from "react";
import { useUserViewModel } from "../viewmodels/useUserViewModel";

export const UsersManagementView = () => {
    const {
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
    } = useUserViewModel();

    return (
        <div style={{ padding: "20px", color: "#fff" }}>
            <h2>Gestión de Usuarios (Técnicos y Clientes)</h2>
            <p style={{ color: "#aaa" }}>Panel exclusivo para administradores.</p>

            {/* Formulario de creación */}
            <form
                onSubmit={handleCreateUser}
                style={{
                    background: "#1e1e1e",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "30px",
                    maxWidth: "500px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}
            >
                <h3>Registrar Nuevo Usuario</h3>

                {error && <div style={{ color: "#ff4d4d", marginBottom: "10px" }}>{error}</div>}
                {successMessage && <div style={{ color: "#4bb543", marginBottom: "10px" }}>{successMessage}</div>}

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", background: "#2a2a2a", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>Correo:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", background: "#2a2a2a", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>Contraseña Temporal:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", background: "#2a2a2a", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>Rol:</label>
                    <select
                        value={rolId}
                        onChange={(e) => setRolId(e.target.value)}
                        style={{ width: "100%", padding: "8px", background: "#2a2a2a", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                    >
                        {roles.map((rol) => (
                            <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    style={{ padding: "10px 15px", background: "#007acc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Crear Usuario
                </button>
            </form>

            {/* Tabla de usuarios existentes */}
            <h3>Usuarios Registrados en el Sistema</h3>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                    <tr style={{ background: "#2d2d2d", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Nombre</th>
                        <th style={{ padding: "12px" }}>Correo</th>
                        <th style={{ padding: "12px" }}>Rol</th>
                        <th style={{ padding: "12px" }}>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} style={{ borderBottom: "1px solid #333" }}>
                            <td style={{ padding: "12px" }}>{u.id}</td>
                            <td style={{ padding: "12px" }}>{u.nombre}</td>
                            <td style={{ padding: "12px" }}>{u.correo}</td>
                            <td style={{ padding: "12px" }}>{u.roles?.nombre || "N/A"}</td>
                            <td style={{ padding: "12px" }}>{u.activo ? "Activo" : "Inactivo"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};