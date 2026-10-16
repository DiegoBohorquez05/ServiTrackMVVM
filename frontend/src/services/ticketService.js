const API_URL = "http://localhost:8000/tickets";

export const ticketService = {
    async getTickets(clienteId = null) {
        const url = clienteId ? `${API_URL}?cliente_id=${clienteId}` : API_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar los tickets");
        return await response.json();
    },

    async createTicket(ticketData) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Error al crear el ticket");
        return data;
    },

    async responderTicket(ticketId, datos) {
        const response = await fetch(`http://localhost:8000/tickets/${ticketId}`, {
            method: "PUT", // O "PATCH" ya que el backend ahora acepta ambos
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Error al actualizar el ticket");
        return data;
    },
};