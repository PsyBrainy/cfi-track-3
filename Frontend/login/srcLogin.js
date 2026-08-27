const axiosInstance = axios.create({
    baseUrl: "http://localhost:8080/user",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
});
const form = document.getElementById('logIn');
form.onsubmit = (data) => logIn(data);
class UserRequest {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

function logIn(data) {
    data.preventDefault();
    console.log("Intentando logear")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (isValidEmail(email)) {
        ocultarMensaje(document.getElementById('responseEmail'));
        console.log('email Valido')
        if (isValidPassword(password)) {
            console.log('password Valido')
            ocultarMensaje(document.getElementById('responsePassword'))
            // Si los campos son válidos hago la petición http
            const userRequest = new UserRequest(email, password);
            userResponse = findUser(userRequest);
            console.log(userResponse);
            if (userResponse && userResponse.token !== '') {
                saveData(userResponse);
                mostrarMensaje("Inicio de sesión exitoso", document.getElementById('responseGeneral'));
                // window.location.href = "../dashboard/indexDashboard.html";
            } else {
                mostrarMensaje("No se pudo iniciar sesión", document.getElementById('responseGeneral'));
            }
        } else mostrarMensaje("Intente ingresando una contraseña de más de 8 caracteres", document.getElementById('responsePassword'));
    } else {
        console.log("Contraseña invalida")
        mostrarMensaje("Intente ingresando una dirección de email válida", document.getElementById('responseEmail'));
    }
}
const findUser = async (userRequest) => {
    try {
        const userResponse = await axiosInstance
            .post("/login", {
                body: JSON.stringify(userRequest)
            });
        return userResponse;
    }
    catch (error) {
        console.error(error);
        mostrarMensaje('Ocurrió un error al iniciar sesión', document.getElementById('responseGeneral'))
    }
    finally {
        console.log("Request completed");
    };
}
const getUserByToken = async (token) => {
    try {
        const userResponse = await axiosInstance
            .post("/getByToken", {
                body: JSON.stringify(token)
            });
        return userResponse;
    }
    catch (error) {
        console.error(error);
        mostrarMensaje('Ocurrió un error al buscar al usuario', document.getElementById('responseGeneral'))
    }
    finally {
        console.log("Request completed");
    };
}
function saveData(response) {
    // Guarda token en localStorage para mantener sesión.
    localStorage.setItem('token', response.token);

    // Guarda datos del usuario para usarlos en la app.
    localStorage.setItem('user', JSON.stringify(response.user));
}
function isValidPassword(password) {
    return (password !== "" && password.length > 8);
}
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (email !== '') && regex.test(email);
}
function mostrarMensaje(texto, elemento) {
    elemento.textContent = texto;
    elemento.style.display = "block"
}
function ocultarMensaje(elemento) {
    elemento.textContent = '';
    elemento.style.display = "none";
}
function seePassword() {
    const password = document.getElementById('password');
    if (password.type === "password") {
        password.type = "text";
    } else if (password.type === "text") {
        password.type = "password";
    }
}
