import { loginUser } from '../api/authApi.js';

const btnLogin = document.getElementById("btn-login");
const loginContent = document.getElementById("login-content");
const loadingContainer = document.getElementById("loading-container");

async function handleLogin(event) {
    event.preventDefault();

    const emailEntry = document.getElementById("input-user").value;
    const passwordEntry = document.getElementById("input-password").value;

    const entryValid = emailEntry && passwordEntry;

    if (!entryValid) {
        checkEntry();
        return;
    }

    try {
        // Some com o formulário e mostra o spinner
        loginContent.classList.add("d-none");
        loadingContainer.classList.remove("d-none");
        loadingContainer.classList.add("d-flex");

        // Faz a requisição de login
        await loginUser({
            email: emailEntry,
            password: passwordEntry
        });

        // Aguarda os 2 segundos forçados antes de redirecionar
        await new Promise(resolve => setTimeout(resolve, 750));

        window.location.href = "/pages/admin/home.html";

    } catch (error) {
        console.error("Error logging in:", error);
        
        // Se der erro, esconde o spinner e traz o formulário de volta
        loadingContainer.classList.add("d-none");
        loadingContainer.classList.remove("d-flex");
        loginContent.classList.remove("d-none");
        
        alert("Login falhou. Verifique suas credenciais e tente novamente.");
    }
}

btnLogin.addEventListener("click", handleLogin);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleLogin(event);
    }
});

function checkEntry () {
    const inputs = document.querySelectorAll(".input")
    inputs.forEach(input => {
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);

        if (input.value === "" || !validEmail) {
            input.classList.add("input-invalid")
            input.addEventListener("click", () => {
                input.classList.remove("input-invalid")
            })
        }
    });
}