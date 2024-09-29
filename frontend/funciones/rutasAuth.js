const API_URL = "http://localhost/backend/auth";
export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos del login:", data);
            // Guardar el token JWT en el almacenamiento local o en cookies
            localStorage.setItem('token', data.token);
            alert('Login exitoso');
            return {
                token: data.token,
                id: data.id,
                user: data.user,
            };
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error en el login');
        }
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        alert('Error al intentar hacer login');
    }
};
// Función para crear una nueva persona (POST /persona)
export async function createPersona(persona) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona)
        });
        if (!response.ok) throw new Error("Error al crear la persona");
        return await response.json();  // Retorna la nueva persona creada
    } catch (error) {
        console.error(error);
        return null;
    }
}