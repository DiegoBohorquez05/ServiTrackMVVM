import React, { useState, useEffect } from "react";
import { LoginView } from "./views/LoginView";
import { userService } from "./services/userService";
import { ticketService } from "./services/ticketService";

export function App() {
    const [user, setUser] = useState(null);

    // Estados para Administrador
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [adminError, setAdminError] = useState(null);
    const [adminSuccess, setAdminSuccess] = useState(null);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState("");

    // Estados para Tickets (Clientes y Técnicos)
    const [tickets, setTickets] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Software");
    const [prioridad, setPrioridad] = useState("Media");
    const [ticketError, setTicketError] = useState(null);
    const [ticketSuccess, setTicketSuccess] = useState(null);

    // Filtros visuales para Técnicos
    const [filtroCategoria, setFiltroCategoria] = useState("Todas");
    const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

    const fetchData = async (currentUser) => {
        try {
            const rolNombre = currentUser.roles?.nombre?.toLowerCase() || "";

            if (rolNombre.includes("administrador")) {
                const [usersData, rolesData] = await Promise.all([
                    userService.getUsuarios(),
                    userService.getRoles(),
                ]);
                setUsuarios(usersData);
                setRoles(rolesData);
                const assignable = rolesData.filter(r => r.nombre.toLowerCase() !== "administrador");
                if (assignable.length > 0) setRolId(assignable[0].id);
            } else if (rolNombre.includes("tecnico") || rolNombre.includes("soporte")) {
                // El técnico ve todos los tickets del sistema
                const ticketsData = await ticketService.getTickets();
                setTickets(ticketsData);
            } else {
                // El cliente ve solo sus tickets
                const ticketsData = await ticketService.getTickets(currentUser.id);
                setTickets(ticketsData);
            }
        } catch (err) {
            console.error("Error al cargar datos:", err);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            fetchData(parsedUser);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        fetchData(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setAdminError(null);
        setAdminSuccess(null);
        try {
            await userService.createUsuario({
                nombre, correo, password, rol_id: Number(rolId), activo: true,
            });
            setAdminSuccess("¡Usuario creado exitosamente!");
            setNombre(""); setCorreo(""); setPassword("");
            fetchData(user);
        } catch (err) {
            setAdminError(err.message);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setTicketError(null);
        setTicketSuccess(null);
        try {
            await ticketService.createTicket({
                titulo, descripcion, categoria, prioridad, cliente_id: user.id,
            });
            setTicketSuccess("¡Ticket creado y enviado a soporte exitosamente!");
            setTitulo(""); setDescripcion("");
            fetchData(user);
        } catch (err) {
            setTicketError(err.message);
        }
    };

    if (!user) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    const rolLower = user.roles?.nombre?.toLowerCase() || "";
    const isAdmin = rolLower.includes("administrador");
    const isTecnico = rolLower.includes("tecnico") || rolLower.includes("soporte");
    const isCliente = !isAdmin && !isTecnico;

    // Filtrados para Admin
    const assignableRoles = roles.filter(r => r.nombre.toLowerCase() !== "administrador");
    const soporteUsers = usuarios.filter(u => u.roles?.nombre?.toLowerCase().includes("tecnico") || u.roles?.nombre?.toLowerCase().includes("soporte"));
    const empleadoUsers = usuarios.filter(u => u.roles?.nombre?.toLowerCase().includes("cliente") || u.roles?.nombre?.toLowerCase().includes("empleado") || u.roles?.nombre?.toLowerCase().includes("trabajador"));

    // Filtrados de tickets aplicados para Técnicos
    const ticketsFiltrados = tickets.filter(t => {
        const matchCat = filtroCategoria === "Todas" || t.categoria === filtroCategoria;
        const matchPri = filtroPrioridad === "Todas" || t.prioridad === filtroPrioridad;
        return matchCat && matchPri;
    });

    const ticketsAbiertos = ticketsFiltrados.filter(t => t.estado === "Abierto");
    const ticketsEnProceso = ticketsFiltrados.filter(t => t.estado === "En Proceso");
    const ticketsCerrados = ticketsFiltrados.filter(t => t.estado === "Cerrado" || t.estado === "Resuelto");

    return (
        <div style={{ fontFamily: "sans-serif", background: "#0b0f19", minHeight: "100vh", width: "100%", color: "#fff", paddingBottom: "40px", boxSizing: "border-box" }}>

            {/* Barra Superior */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#111827", borderBottom: "1px solid #1f2937", width: "100%", boxSizing: "border-box" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#f3f4f6" }}>ServiTrack</h2>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            👤 {user.nombre} | Rol: <span style={{ color: "#38bdf8" }}>{user.roles?.nombre || "Usuario"}</span>
          </span>
                </div>
                <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#e11d48", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ padding: "24px 30px", width: "100%", boxSizing: "border-box" }}>

                {/* ========================================================= */}
                {/* VISTA DE ADMINISTRADOR                                    */}
                {/* ========================================================= */}
                {isAdmin && (
                    <>
                        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "15px", marginBottom: "15px", color: "#e5e7eb" }}>👤 Registrar Nuevo Usuario en la Plataforma</h3>
                            {adminError && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "10px" }}>{adminError}</div>}
                            {adminSuccess && <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "10px" }}>{adminSuccess}</div>}

                            <form onSubmit={handleCreateUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "15px", alignItems: "end" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Nombre Completo</label>
                                    <input type="text" placeholder="Ej. Ana Gómez" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Correo Electrónico</label>
                                    <input type="email" placeholder="ana@empresa.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Contraseña</label>
                                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Rol de Usuario</label>
                                    <select value={rolId} onChange={(e) => setRolId(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }}>
                                        {assignableRoles.map((r) => (<option key={r.id} value={r.id}>{r.nombre}</option>))}
                                    </select>
                                </div>
                                <button type="submit" style={{ padding: "9px 20px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", height: "37px" }}>Crear</button>
                            </form>
                        </div>

                        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "15px", margin: "0 0 15px 0", color: "#e5e7eb" }}>📂 Directorio de Usuarios Registrados</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div style={{ background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "6px", padding: "15px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "12px", color: "#9ca3af", fontWeight: "bold" }}>
                                        <span>🎧 PERSONAL DE SOPORTE TI</span><span>{soporteUsers.length}</span>
                                    </div>
                                    {soporteUsers.map((u) => (
                                        <div key={u.id} style={{ background: "#111827", padding: "10px 12px", borderRadius: "6px", marginBottom: "8px", border: "1px solid #1f2937" }}>
                                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f3f4f6" }}>{u.nombre}</div>
                                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{u.correo}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "6px", padding: "15px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "12px", color: "#9ca3af", fontWeight: "bold" }}>
                                        <span>👥 EMPLEADOS / TRABAJADORES</span><span>{empleadoUsers.length}</span>
                                    </div>
                                    {empleadoUsers.map((u) => (
                                        <div key={u.id} style={{ background: "#111827", padding: "10px 12px", borderRadius: "6px", marginBottom: "8px", border: "1px solid #1f2937" }}>
                                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f3f4f6" }}>{u.nombre}</div>
                                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{u.correo}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ========================================================= */}
                {/* VISTA DE CLIENTE / EMPLEADO (Creación de tickets propios)  */}
                {/* ========================================================= */}
                {isCliente && (
                    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "15px", marginBottom: "15px", color: "#e5e7eb" }}>🎫 Crear Nuevo Ticket de Soporte</h3>
                        {ticketError && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "10px" }}>{ticketError}</div>}
                        {ticketSuccess && <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "10px" }}>{ticketSuccess}</div>}

                        <form onSubmit={handleCreateTicket} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr auto", gap: "15px", alignItems: "end" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Título</label>
                                <input type="text" placeholder="Ej. Fallo en red" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Descripción del problema</label>
                                <input type="text" placeholder="Detalles de la incidencia..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Área Afectada</label>
                                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }}>
                                    <option value="Redes">Redes</option>
                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "5px" }}>Prioridad</label>
                                <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={{ width: "100%", padding: "9px 12px", background: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", fontSize: "13px", boxSizing: "border-box" }}>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>
                            <button type="submit" style={{ padding: "9px 20px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", height: "37px" }}>Enviar</button>
                        </form>
                    </div>
                )}

                {/* ========================================================= */}
                {/* BARRA DE FILTROS (Visible exclusivamente para Técnicos)     */}
                {/* ========================================================= */}
                {isTecnico && (
                    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
              🔍 Filtrar Tickets
            </span>
                        <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#9ca3af", alignItems: "center" }}>
                            <div>
                                Categoría:{" "}
                                <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ background: "#1f2937", color: "#fff", border: "1px solid #374151", padding: "6px 10px", borderRadius: "6px", marginLeft: "5px" }}>
                                    <option value="Todas">Todas las categorías</option>
                                    <option value="Redes">Redes</option>
                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                Prioridad:{" "}
                                <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)} style={{ background: "#1f2937", color: "#fff", border: "1px solid #374151", padding: "6px 10px", borderRadius: "6px", marginLeft: "5px" }}>
                                    <option value="Todas">Todas las prioridades</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* TABLERO DE INCIDENCIAS TI (Kanban de tickets)             */}
                {/* ========================================================= */}
                <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "20px" }}>
                    <h3 style={{ fontSize: "15px", marginBottom: "15px", color: "#e5e7eb" }}>
                        {isTecnico ? "📋 Tablero de Gestión de Incidencias TI" : "📋 Tablero de Mis Tickets de Soporte"}
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>

                        {/* Columna Abiertos */}
                        <div style={{ background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "6px", padding: "15px", minHeight: "180px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#fbbf24", fontSize: "13px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #1f2937", paddingBottom: "8px" }}>
                                <span>🕒 Abiertos</span><span>{ticketsAbiertos.length}</span>
                            </div>
                            {ticketsAbiertos.length === 0 ? (
                                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", marginTop: "35px" }}>Sin tickets en esta columna</div>
                            ) : (
                                ticketsAbiertos.map(t => (
                                    <div key={t.id} style={{ background: "#111827", padding: "12px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #1f2937", fontSize: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "11px" }}>#{t.id} - {t.categoria}</span>
                                            <span style={{ background: t.prioridad === "Alta" ? "#7f1d1d" : "#1e3a8a", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>{t.prioridad}</span>
                                        </div>
                                        <div style={{ fontWeight: "bold", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{t.titulo}</div>
                                        <div style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "8px" }}>{t.descripcion}</div>
                                        {t.usuarios?.nombre && <div style={{ color: "#6b7280", fontSize: "10px", marginBottom: "8px" }}>Por: {t.usuarios.nombre}</div>}

                                        {/* Campo de respuesta visible para Técnicos */}
                                        {isTecnico && (
                                            <div style={{ marginTop: "8px", borderTop: "1px solid #1f2937", paddingTop: "8px" }}>
                                                <div style={{ fontSize: "10px", color: "#38bdf8", marginBottom: "4px" }}>Agregar respuesta / diagnóstico:</div>
                                                <input type="text" placeholder="Escribe una respuesta y presiona Enter..." style={{ width: "100%", padding: "6px", background: "#1f2937", border: "1px solid #374151", borderRadius: "4px", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Columna En Proceso */}
                        <div style={{ background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "6px", padding: "15px", minHeight: "180px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#60a5fa", fontSize: "13px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #1f2937", paddingBottom: "8px" }}>
                                <span>⚙️ En Proceso</span><span>{ticketsEnProceso.length}</span>
                            </div>
                            {ticketsEnProceso.length === 0 ? (
                                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", marginTop: "35px" }}>Sin tickets en esta columna</div>
                            ) : (
                                ticketsEnProceso.map(t => (
                                    <div key={t.id} style={{ background: "#111827", padding: "12px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #1f2937", fontSize: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "11px" }}>#{t.id} - {t.categoria}</span>
                                            <span style={{ background: "#1e3a8a", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>{t.prioridad}</span>
                                        </div>
                                        <div style={{ fontWeight: "bold", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{t.titulo}</div>
                                        <div style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "8px" }}>{t.descripcion}</div>
                                        {t.usuarios?.nombre && <div style={{ color: "#6b7280", fontSize: "10px", marginBottom: "8px" }}>Por: {t.usuarios.nombre}</div>}

                                        {isTecnico && (
                                            <div style={{ marginTop: "8px", borderTop: "1px solid #1f2937", paddingTop: "8px" }}>
                                                <input type="text" placeholder="Escribe una respuesta y presiona Enter..." style={{ width: "100%", padding: "6px", background: "#1f2937", border: "1px solid #374151", borderRadius: "4px", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Columna Cerrados / Resueltos */}
                        <div style={{ background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "6px", padding: "15px", minHeight: "180px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#4ade80", fontSize: "13px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #1f2937", paddingBottom: "8px" }}>
                                <span>✔️ Cerrados / Resueltos</span><span>{ticketsCerrados.length}</span>
                            </div>
                            {ticketsCerrados.length === 0 ? (
                                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", marginTop: "35px" }}>Sin tickets en esta columna</div>
                            ) : (
                                ticketsCerrados.map(t => (
                                    <div key={t.id} style={{ background: "#111827", padding: "12px", borderRadius: "6px", marginBottom: "10px", border: "1px solid #1f2937", fontSize: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "11px" }}>#{t.id} - {t.categoria}</span>
                                            <span style={{ background: "#065f46", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>Resuelto</span>
                                        </div>
                                        <div style={{ fontWeight: "bold", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{t.titulo}</div>
                                        <div style={{ color: "#9ca3af", fontSize: "11px" }}>{t.descripcion}</div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;