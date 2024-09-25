function validacionesFormulario() {
    const nombre = document.getElementById('nombre');
    const nombre2 = document.getElementById('nombre2');
    const apellido = document.getElementById('apellido');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const email = document.getElementById('email');
    const cedula = document.getElementById('cedula');
    const rut = document.getElementById('rut');
    const imagen = document.getElementById('miImagen');

    const nombreError = document.getElementById('nombreError');
    const nombre2Error = document.getElementById('nombre2Error');
    const apellidoError = document.getElementById('apellidoError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const emailError = document.getElementById('emailError');
    const cedulaError = document.getElementById('cedulaError');
    const rutError = document.getElementById('rutError');
    const imagenError = document.getElementById('imagenError');

    // Resetear errores antes de la validación
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.style.display = 'none'); // Esconder todos los mensajes de error

    let isValid = true;

    // Validaciones campo por campo

    // Validación de nombre
    if (nombre.value.trim() === '' || nombre.value.length < 2 || nombre.value.length > 50) {
        nombreError.textContent = 'El nombre es obligatorio y debe tener entre 2 y 50 caracteres.';
        nombreError.style.display = 'block';
        isValid = false;
    }

    // Validación de nombre2 (opcional, pero si se ingresa, debe tener entre 2 y 50 caracteres)
    if (nombre2.value.trim() !== '' && (nombre2.value.length < 2 || nombre2.value.length > 50)) {
        nombre2Error.textContent = 'El segundo nombre debe tener entre 2 y 50 caracteres si se ingresa.';
        nombre2Error.style.display = 'block';
        isValid = false;
    }

    // Validación de apellido
    if (apellido.value.trim() === '' || apellido.value.length < 2 || apellido.value.length > 50) {
        apellidoError.textContent = 'El apellido es obligatorio y debe tener entre 2 y 50 caracteres.';
        apellidoError.style.display = 'block';
        isValid = false;
    }

    // Validación de password
    if (password.value.trim() === '' || password.value.length < 6 || !/[A-Z]/.test(password.value) || !/[a-z]/.test(password.value) || !/[0-9]/.test(password.value) || !/[!@#$%^&*_-]/.test(password.value)) {
        passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.';
        passwordError.style.display = 'block';
        isValid = false;
    }

    // Validación de confirmPassword
    if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden.';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    }

    // Validación de email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email.value.trim() === '' || !emailPattern.test(email.value)) {
        emailError.textContent = 'El correo electrónico es obligatorio y debe ser válido.';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Validación de cedula
    const cedulaPattern = /^\d{1}\.\d{3}\.\d{3}-\d{1}$/;
    if (cedula.value.trim() === '' || !cedulaPattern.test(cedula.value) || !validarCedulaUruguaya(cedula.value)) {
        cedulaError.textContent = 'La cédula es obligatoria, debe seguir el formato y ser válida.';
        cedulaError.style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function validarCedulaUruguaya(cedula) {

    // Eliminar puntos y guiones
    cedula = cedula.replace(/\./g, '').replace(/-/g, '');

    // La cédula debe tener 7 u 8 dígitos (sin contar el dígito verificador)
    if (cedula.length < 7 || cedula.length > 8) {
        return false;
    }

    // Obtener el dígito verificador
    let digitoVerificador = parseInt(cedula.slice(-1));

    // Completar con ceros a la izquierda si la cédula tiene menos de 8 dígitos
    cedula = cedula.padStart(8, '0');

    // Constantes para el algoritmo de validación
    let coeficientes = [2, 9, 8, 7, 6, 3, 4];
    let suma = 0;

    // Calcular la suma ponderada de los primeros 7 dígitos
    for (let i = 0; i < 7; i++) {
        suma += parseInt(cedula[i]) * coeficientes[i];
    }

    // Calcular el módulo 10 de la suma
    let modulo = suma % 10;

    // Determinar el dígito verificador correcto
    let digitoCorrecto = modulo === 0 ? 0 : 10 - modulo;

    // Verificar si el dígito verificador es correcto
    return digitoCorrecto === digitoVerificador;
};

export { validacionesFormulario };