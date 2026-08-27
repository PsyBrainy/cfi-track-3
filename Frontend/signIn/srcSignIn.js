const axiosInstance = axios.create({
    baseUrl: "http://localhost:8080/user",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
});
const form = document.getElementById('signIn');
form.onsubmit = (data) => signIn(data);
class UserRequest {
    constructor(
        name,
        lastName,
        DNI,
        email,
        password,
        passwordRepeat,
        agree
    ) {
        this.name = name,
            this.lastName = lastName,
            this.DNI = DNI,
            this.email = email,
            this.password = password,
            this.passwordRepeat = passwordRepeat
        this.agree = agree;
    }
}

function signIn(data) {
    data.preventDefault();
    const userRequest = new UserRequest(document.getElementById('name').value,
        document.getElementById('lastName').value,
        document.getElementById('DNI').value,
        document.getElementById('email').value,
        document.getElementById('password').value,
        document.getElementById('passwordRepeat').value,
        document.getElementById('agree').checked
    );
    // así con los otros campos
    if (validateInputs(userRequest)) {
        const userResponse = createUser(userRequest);
        if (userResponse !== '') {
            // window.location.href = "../login/indexLogin.html";
            console.log(userResponse);
        } else {
            mostrarMensaje('Ocurrió un error al crear tu cuenta', document.getElementById('responseGeneral'))
        }
    };
}
function validateInputs(userData) {
    ok = true;
    if (userData.name === '' || userData.name.length < 2) {
        mostrarMensaje('El nombre no es válido', document.getElementById('responseName'));
        ok = false;
    } else ocultarMensaje(document.getElementById('responseName'))
    if (userData.lastName === '' || userData.lastName.length < 2) {
        mostrarMensaje('El apellido no es válido', document.getElementById('responseLastName'));
        ok = false;
    } else ocultarMensaje(document.getElementById('responseLastName'))
    userData.DNI = userData.DNI.replaceAll('.', '');
    userData.DNI = userData.DNI.replaceAll(' ', '');
    const regexDNI = /^[0-9. ]+$/;
    if (!regexDNI.test(userData.DNI)) {
        mostrarMensaje('El DNI solo puede contener números', document.getElementById('responseDNI'));
        ok = false;
    } else if (userData.DNI === '' || userData.DNI.length > 9 || userData.DNI.length < 7) {
        mostrarMensaje('El DNI no puede estar vacío y debe tener como mínimo 7 números y como máximo 9', document.getElementById('responseDNI'));
        ok = false;
    } else ocultarMensaje(document.getElementById('responseDNI'))
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(userData.email) && userData.email !== '') {
        mostrarMensaje('Debe ingresar un email válido', document.getElementById('responseEmail'));
        ok = false;
    } else ocultarMensaje(document.getElementById('responseEmail'))
    let regexPassword = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!regexPassword.test(userData.password)) {
        mostrarMensaje('La contraseña debe tener como mínimo 8 caracteres y contener al menos un número y un caracter especial', document.getElementById('responsePassword'));
        ok = false;
    } else {
        ocultarMensaje(document.getElementById('responsePassword'));
        if (userData.password !== userData.passwordRepeat) {
            mostrarMensaje('Las contraseñas deben ser iguales', document.getElementById('responsePasswordRepeat'));
            ok = false;
        } else {
            ocultarMensaje(document.getElementById('responsePasswordRepeat'));
        }
    }
    if (!userData.agree) {
        mostrarMensaje('Para poder crear una cuenta debes estar de acuerdo con nuestro términos de privacidad y de servicio', document.getElementById('responseAgree'))
        ok = false;
    }
    //Retorna si todos los campos son válidos
    return ok;
}
const createUser = async (userData) => {
    try {
        const userResponse = await axiosInstance
            .post("/create", {
                body: JSON.stringify(userData)
            });
        return userResponse;
    }
    catch (error) {
        console.error(error);
        mostrarMensaje('Ocurrió un error al crear al usuario', document.getElementById('responseGeneral'))
    }
    finally {
        console.log("Request completed");
    };
}
function mostrarMensaje(texto, elemento) {
    elemento.textContent = texto;
    elemento.style.display = "block"
}
function ocultarMensaje(elemento) {
    elemento.textContent = '';
    elemento.style.display = "none";
}
function seePassword(data) {
    const password = document.getElementById('password');
    if (password.type === "password") {
        password.type = "text";
    } else if (password.type === "text") {
        password.type = "password";
    }
}
function seePasswordRepeat() {
    const password = document.getElementById('passwordRepeat');
    if (password.type === "password") {
        password.type = "text";
    } else if (password.type === "text") {
        password.type = "password";
    }
}