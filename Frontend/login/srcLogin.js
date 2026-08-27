const baseUrl = "http://localhost:8080";
const form = document.getElementById('logIn');
form.onsubmit = (data) => logIn(data);
class userRequest {
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
            userResponse = findUser(email, password);
            console.log(userResponse);
            if (userResponse && userResponse.token !== '') {
                saveData(response);
                mostrarMensaje("Inicio de sesión exitoso", document.getElementById('responseGeneral'));
                window.location.href = "../dashboard/indexDashboard.html";
            } else {
                mostrarMensaje("No se pudo iniciar sesión", document.getElementById('responseGeneral'));
            }
        } else mostrarMensaje("Intente ingresando una contraseña de más de 8 caracteres", document.getElementById('responsePassword'));
    } else {
        console.log("Contraseña invalida")
        mostrarMensaje("Intente ingresando una dirección de email válida", document.getElementById('responseEmail'));
    }
}
function findUser(email, password) {
    const userR = new userRequest(email, password);
    response = fetch(baseUrl.concat("/login"), {
        body: JSON.stringify(userR),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else throw new Error("Error al logear al usuario")
        }).catch(error => {
            console.error("Ocurrió un error al logear al usuario");
            console.error(error);
            mostrarMensaje("Ocurrió un error", document.getElementById('generalResponse'));
        }
        );
    return response;
}
function getUserByToken(token) {
    fetch(baseUrl.concat("/getById"), {
        body: JSON.stringify(token),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else throw new Error("Ocurrió un error al buscar al usuario")
        }).catch(error => {
            console.error(error);
        }
        );
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
function seePassword(){
    const password = document.getElementById('password');
    if(password.type === "password"){
        password.type = "text";
    }else if(password.type === "text"){
        password.type = "password";
    }
}
