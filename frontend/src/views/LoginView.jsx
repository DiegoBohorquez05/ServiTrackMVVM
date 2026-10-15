import React from "react";
import { useAuthViewModel } from "../viewmodels/useAuthViewModel";

export const LoginView = ({ onLoginSuccess }) => {
    const {
        correo,
        setCorreo,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    } = useAuthViewModel(onLoginSuccess);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
            background: "#0b0f19",
            fontFamily: "sans-serif",
            color: "#fff",
            boxSizing: "border-box",
            position: "fixed",
            top: 0,
            left: 0
        }}>
            <form
                onSubmit={handleLogin}
                style={{
                    background: "#111827",
                    border: "1px solid #1f2937",
                    padding: "40px 35px",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#f3f4f6" }}>
                        ServiTrack
                    </h2>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                        Inicia sesión para acceder al sistema
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#f87171",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        fontSize: "13px",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        placeholder="admin@servitrack.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "11px 14px",
                            borderRadius: "6px",
                            border: "1px solid #374151",
                            background: "#1f2937",
                            color: "#fff",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>
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
                            padding: "11px 14px",
                            borderRadius: "6px",
                            border: "1px solid #374151",
                            background: "#1f2937",
                            color: "#fff",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0ea5e9",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "background 0.2s"
                    }}
                >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
};