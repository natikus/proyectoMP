// Definir la URL base de tu API
const API_URL = "http://localhost/backend/usuario";

// Función para actualizar una persona por ID (PUT /usuario/:id)
export async function updateUsuario(id, personaData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(personaData)
        });

        if (!response.ok) throw new Error("Error al actualizar la persona");

        // Lee la respuesta una sola vez
        return await response.json(); // Retorna la persona actualizada
    } catch (error) {
        console.error(error);
        return null; // Retorna null en caso de error
    }
};


// Función para eliminar una persona por ID (DELETE /usuario/:id)
export async function deleteUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) throw new Error("Error al eliminar la persona");
        return await response.json();  // Retorna el mensaje de confirmación
    } catch (error) {
        console.error(error);
        return null;
    }
}

