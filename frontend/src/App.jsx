import React, { useState, useEffect } from "react";
import { LoginView } from "./views/LoginView";
import { userService } from "./services/userService";

export function App() {
    const [user, setUser] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Estados para el formulario de registro
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState("");

    const fetchData = async () => {
        try {
            const [usersData, rolesData] = await Promise.all([
                userService.getUsuarios(),
                userService.getRoles(),
            ]);
            setUsuarios(usersData);
            setRoles(rolesData);

            // Excluir el rol Administrador de los asignables
            const assignable = rolesData.filter(
                (r) => r.nombre.toLowerCase() !== "administrador"
            );
            if (assignable.length > 0) {
                setRolId(assignable[0].id);
            }
        } catch (err) {
            console.error("Error al cargar los datos:", err);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            fetchData();
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        fetchData();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

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
            fetchData(); // Recargar la lista de usuarios
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    // Filtrar los roles disponibles para no permitir crear Administradores
    const assignableRoles = roles.filter(
        (r) => r.nombre.toLowerCase() !== "administrador"
    );

    // Clasificación de usuarios para las columnas del directorio
    const soporteUsers = usuarios.filter(
        (u) =>
            u.roles?.nombre?.toLowerCase().includes("tecnico") ||
            u.roles?.nombre?.toLowerCase().includes("soporte")
    );

    const empleadoUsers = usuarios.filter(
        (u) =>
            u.roles?.nombre?.toLowerCase().includes("cliente") ||
            u.roles?.nombre?.toLowerCase().includes("empleado") ||
            u.roles?.nombre?.toLowerCase().includes("trabajador")
    );

    return (
        <div
            style={{
                fontFamily: "sans-serif",
                background: "#0b0f19",
                minHeight: "100vh",
                width: "100%",
                color: "#fff",
                paddingBottom: "40px",
                boxSizing: "border-box",
            }}
        >
            {/* Barra Superior */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 30px",
                    background: "#111827",
                    borderBottom: "1px solid #1f2937",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#f3f4f6" }}>
                        ServiTrack
                    </h2>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            👤 {user.nombre} | Rol:{" "}
                        <span style={{ color: "#38bdf8" }}>
              {user.roles?.nombre || "Administrador"}
            </span>
          </span>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 16px",
                        background: "#e11d48",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "13px",
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ padding: "24px 30px", width: "100%", boxSizing: "border-box" }}>
                {/* Sección 1: Registrar Nuevo Usuario */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "24px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "15px",
                            marginBottom: "15px",
                            color: "#e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        👤 Registrar Nuevo Usuario en la Plataforma
                    </h3>

                    {error && (
                        <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "10px" }}>
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "10px" }}>
                            {successMessage}
                        </div>
                    )}

                    <form
                        onSubmit={handleCreateUser}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                            gap: "15px",
                            alignItems: "end",
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "5px",
                                }}
                            >
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                placeholder="Ej. Ana Gómez"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "5px",
                                }}
                            >
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="ana@empresa.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "5px",
                                }}
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "5px",
                                }}
                            >
                                Rol de Usuario
                            </label>
                            <select
                                value={rolId}
                                onChange={(e) => setRolId(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    boxSizing: "border-box",
                                }}
                            >
                                {assignableRoles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: "9px 20px",
                                background: "#0ea5e9",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "13px",
                                height: "37px",
                            }}
                        >
                            Crear
                        </button>
                    </form>
                </div>

                {/* Sección 2: Directorio de Usuarios Registrados */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "15px",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "15px",
                                margin: 0,
                                color: "#e5e7eb",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            📁 Directorio de Usuarios Registrados
                        </h3>
                        <span
                            style={{
                                background: "#1f2937",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                color: "#9ca3af",
                            }}
                        >
              Total: {usuarios.length}
            </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* Columna Personal de Soporte TI */}
                        <div
                            style={{
                                background: "#0b0f19",
                                border: "1px solid #1f2937",
                                borderRadius: "6px",
                                padding: "15px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    fontWeight: "bold",
                                }}
                            >
                                <span>🎧 PERSONAL DE SOPORTE TI</span>
                                <span>{soporteUsers.length}</span>
                            </div>
                            {soporteUsers.length === 0 ? (
                                <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", padding: "10px" }}>
                                    No hay personal de soporte registrado
                                </p>
                            ) : (
                                soporteUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "#111827",
                                            padding: "10px 12px",
                                            borderRadius: "6px",
                                            marginBottom: "8px",
                                            border: "1px solid #1f2937",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f3f4f6" }}>
                                                {u.nombre}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{u.correo}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Columna Empleados / Trabajadores */}
                        <div
                            style={{
                                background: "#0b0f19",
                                border: "1px solid #1f2937",
                                borderRadius: "6px",
                                padding: "15px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "12px",
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    fontWeight: "bold",
                                }}
                            >
                                <span>👥 EMPLEADOS / TRABAJADORES</span>
                                <span>{empleadoUsers.length}</span>
                            </div>
                            {empleadoUsers.length === 0 ? (
                                <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", padding: "10px" }}>
                                    No hay empleados registrados
                                </p>
                            ) : (
                                empleadoUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "#111827",
                                            padding: "10px 12px",
                                            borderRadius: "6px",
                                            marginBottom: "8px",
                                            border: "1px solid #1f2937",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f3f4f6" }}>
                                                {u.nombre}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{u.correo}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección 3: Filtrar Tickets */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        padding: "15px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
          <span
              style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
              }}
          >
            🔍 Filtrar Tickets
          </span>
                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            fontSize: "13px",
                            color: "#9ca3af",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            Categoría:{" "}
                            <select
                                style={{
                                    background: "#1f2937",
                                    color: "#fff",
                                    border: "1px solid #374151",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    marginLeft: "5px",
                                }}
                            >
                                <option>Todas las categorías</option>
                            </select>
                        </div>
                        <div>
                            Prioridad:{" "}
                            <select
                                style={{
                                    background: "#1f2937",
                                    color: "#fff",
                                    border: "1px solid #374151",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    marginLeft: "5px",
                                }}
                            >
                                <option>Todas las prioridades</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sección 4: Tablero de Gestión de Incidencias TI */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: "8px",
                        padding: "20px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "15px",
                            marginBottom: "15px",
                            color: "#e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        📋 Tablero de Gestión de Incidencias TI
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                        {/* Columna Abiertos */}
                        <div
                            style={{
                                background: "#0b0f19",
                                border: "1px solid #1f2937",
                                borderRadius: "6px",
                                padding: "15px",
                                minHeight: "130px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    color: "#fbbf24",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    marginBottom: "15px",
                                    borderBottom: "1px solid #1f2937",
                                    paddingBottom: "8px",
                                }}
                            >
                                <span>🕒 Abiertos</span>
                                <span>0</span>
                            </div>
                            <div
                                style={{
                                    color: "#6b7280",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    marginTop: "25px",
                                }}
                            >
                                Sin tickets en esta columna
                            </div>
                        </div>

                        {/* Columna En Proceso */}
                        <div
                            style={{
                                background: "#0b0f19",
                                border: "1px solid #1f2937",
                                borderRadius: "6px",
                                padding: "15px",
                                minHeight: "130px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    color: "#60a5fa",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    marginBottom: "15px",
                                    borderBottom: "1px solid #1f2937",
                                    paddingBottom: "8px",
                                }}
                            >
                                <span>⚙️ En Proceso</span>
                                <span>0</span>
                            </div>
                            <div
                                style={{
                                    color: "#6b7280",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    marginTop: "25px",
                                }}
                            >
                                Sin tickets en esta columna
                            </div>
                        </div>

                        {/* Columna Cerrados / Resueltos */}
                        <div
                            style={{
                                background: "#0b0f19",
                                border: "1px solid #1f2937",
                                borderRadius: "6px",
                                padding: "15px",
                                minHeight: "130px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    color: "#4ade80",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    marginBottom: "15px",
                                    borderBottom: "1px solid #1f2937",
                                    paddingBottom: "8px",
                                }}
                            >
                                <span>✔️ Cerrados / Resueltos</span>
                                <span>0</span>
                            </div>
                            <div
                                style={{
                                    color: "#6b7280",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    marginTop: "25px",
                                }}
                            >
                                Sin tickets en esta columna
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;