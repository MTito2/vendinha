import { setStorage } from "../services/storage.js";
import { getStorage } from "../services/storage.js";

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last-name");

const btnReturn = document.getElementById("btn-return")

// Criar um elemento de alerta para mensagens de erro
const registerBtn = document.getElementById("register-btn");
const alertDiv = document.createElement("div");
alertDiv.className = "alert alert-danger position-absolute text-center p-2";
alertDiv.id = "alert-div";
alertDiv.style.display = "none";
registerBtn.parentElement.appendChild(alertDiv);

// Preenche os campos com os valores do localStorage, se existirem
getStorage("name") ? nameInput.value = getStorage("name") : null;
getStorage("lastName") ? lastNameInput.value = getStorage("lastName") : null;

// Adicionar evento de clique ao botão de registro
registerBtn.addEventListener("click", (e) => {
    if (e.target.id === "register-btn") {
        const name = nameInput.value;
        const lastName = lastNameInput.value;
        setStorage("name", name);
        setStorage("lastName", lastName);

        console.log("Nome:", name);
        console.log("Sobrenome:", lastName);

        // Exibir mensagem de erro se algum campo estiver vazio
        if (nameInput.value === "" || lastNameInput.value === "") {
            alertDiv.textContent = "Por favor, preencha todos os campos.";
            alertDiv.style.display = "block";

            setTimeout(() => {
                alertDiv.style.display = "none";
            }, 3000);
        }

        else {

            window.location.href = "products.html";
        }}   
    }
);


btnReturn.addEventListener("click", () => {
    window.location.href = `/index.html?local=${getStorage("local")}`
})
