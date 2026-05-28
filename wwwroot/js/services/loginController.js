import { loginUser } from '../api/authApi.js';

const btnLogin = document.getElementById("btn-login");

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
        await loginUser({
            email: emailEntry,
            password: passwordEntry
        });

        window.location.href = "/pages/admin/home.html";

    } catch (error) {
        console.error("Error logging in:", error);
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