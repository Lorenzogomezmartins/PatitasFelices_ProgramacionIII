// -------------------------------------------------------------
// Lógica de Login/Creación de Usuario
// -------------------------------------------------------------

async function handleUserLogin(event) {
    event.preventDefault();

    const userNameInput = document.getElementById("userName");
    const userLastNameInput = document.getElementById("userLastName");
    const continueBtn = document.getElementById("continueBtn");

    const nombre = userNameInput.value.trim();
    const apellido = userLastNameInput.value.trim();

    if (!nombre || !apellido) {
        alert("Por favor, ingresa tu nombre y apellido.");
        return;
    }

    continueBtn.textContent = "Ingresando...";
    continueBtn.disabled = true;

    try {
        // La ruta del backend está configurada para CREAR o LOGGEAR.
        // Se asume que el controlador 'crearUsuario' maneja el "upsert" (creación si no existe, o retorno si sí existe).
        const API_URL_LOGIN = "http://localhost:4000/api/usuarios/login"; 
        
        const respuesta = await fetch(API_URL_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, apellido }),
        });

        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
            // Muestra el error devuelto por el servidor
            throw new Error(data.error || "Error al iniciar sesión.");
        }

        // 🟢 Éxito: Guardar información del usuario loggeado/creado en localStorage
        const usuarioLoggeado = data.usuario; 
        
        // Guardar como JSON en localStorage
        localStorage.setItem("usuarioLoggeado", JSON.stringify(usuarioLoggeado));
        
        // 3. Redirigir al dashboard
        window.location.href = "../pages/dashboard-user.html"; 

    } catch (error) {
        console.error("Error en el login/creación:", error);
        alert(`Fallo en el ingreso: ${error.message}`);
        
        continueBtn.textContent = "Continuar";
        continueBtn.disabled = false; 
    }
}

function setupLoginListeners() {
    const userForm = document.getElementById("userForm");
    const userNameInput = document.getElementById("userName");
    const userLastNameInput = document.getElementById("userLastName");
    const continueBtn = document.getElementById("continueBtn");

    // Función para habilitar/deshabilitar el botón
    function checkInputs() {
        continueBtn.disabled = !(userNameInput.value.trim() && userLastNameInput.value.trim());
    }

    userNameInput.addEventListener("input", checkInputs);
    userLastNameInput.addEventListener("input", checkInputs);

    // Inicialmente deshabilitar el botón
    checkInputs();

    if (userForm) {
        userForm.addEventListener("submit", handleUserLogin);
    }
}


// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    setupLoginListeners();
});