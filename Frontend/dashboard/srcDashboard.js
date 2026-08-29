// Se activa al cargar la página
addEventListener("DOMContentLoaded", (event) => onInit(event));
// Clase que almacenará los datos de la cuenta
class AccountData {
    constructor(balance, accountNumber, currency, alias, isActive){
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.currency = currency;
        this.alias = alias;
        this.isActive = isActive;
    }
}
// Función asíncrona que se ejcuta al cargar la página se encarga de comprobar
// si hay o no un token y en caso de no haberlo o ser inválido redirige a login
async function onInit(event) {
    const token = localStorage.getItem("token");
    if (token != null) {
        let accountData = await getAccount();
        mostrarInfo(accountData);
    } else {
        window.location.href = "../login/indexLogin.html"
    }
}
// Instancia para poder realizar peticiones HTTP
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 5000,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
});
const getAccount = async () => {
    try {
        const response = await axiosInstance
            .get("/account");
        return response.data;
    }
    catch (error) {
        window.location.href= "../login/indexLogin.html";
        console.error(error);
    }
    finally {
        console.log("Request completed");
    };
}
function mostrarInfo(accountData){
    balance = document.getElementById('balance');
    welcome = document.getElementById('welcome');
    balance.textContent = accountData.balance + " " + accountData.currency;
}
function mostrarMensaje(texto, elemento) {
    elemento.textContent = texto;
    elemento.style.display = "block"
}
function ocultarMensaje(elemento) {
    elemento.textContent = '';
    elemento.style.display = "none";
}