// LOGIN / CREACIÓN DE USUARIO
//
// Funcionalidad:
// - Permite que un usuario ingrese con nombre y apellido.
// - Si el usuario no existe, se crea automáticamente (upsert).
// - Valida que ambos campos estén completos antes de enviar la solicitud.
// - Deshabilita el botón de continuar mientras se procesa la petición.
// - Guarda los datos del usuario en localStorage al iniciar sesión.
// - Redirige automáticamente al dashboard de usuario.
// - Habilita/deshabilita el botón de continuar según si los inputs están completos.

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
           
            throw new Error(data.error || "Error al iniciar sesión.");
        }

        //Éxito: Guardar información del usuario loggeado/creado en localStorage
        const usuarioLoggeado = data.usuario; 
        
        // Guardar como JSON en localStorage
        localStorage.setItem("usuarioLoggeado", JSON.stringify(usuarioLoggeado));
        
        // Redirigir al dashboard
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