import { validacionesFormulario } from "./../validaciones.js"; // Asegúrate de que la ruta sea correcta

document.getElementById('validateBtn').addEventListener('click', async () => {
    if (validacionesFormulario()) {
        const nombre = document.getElementById('nombre');
        const nombre2 = document.getElementById('nombre2');
        const apellido = document.getElementById('apellido');
        const password = document.getElementById('password');
        const email = document.getElementById('email');
        const cedula = document.getElementById('cedula');
        const rut = document.getElementById('rut');

        // Crear el objeto nuevaPersona, incluyendo nombre2 solo si tiene un valor
        const nuevaPersona = {
            nombre: nombre.value,
            apellido: apellido.value,
            contrasena: password.value,
            email: email.value,
            cedula: cedula.value,
            rut: rut.value,
        };

        // Si nombre2 tiene un valor, lo agregamos al objeto
        if (nombre2.value.trim() !== '') {
            nuevaPersona.nombre2 = nombre2.value;
        }

        try {
            const responseAlta = await fetch('https://localhost/backend/personas', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaPersona),
            });

            if (responseAlta.ok) {
                alert('Todos los campos son válidos.');
                console.log(nuevaPersona);
            } else {
                alert('Error al registrar la persona');
            }
        } catch (error) {
            console.error('Error al registrar la persona:', error);
            alert('Error al registrar la persona');
        }
    }
});
