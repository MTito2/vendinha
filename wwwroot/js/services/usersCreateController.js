import { registerUser } from "../api/authApi.js";

document.getElementById("btn-send").addEventListener("click", async (event) => {
    event.preventDefault();
    
    // Captura dos elementos do DOM
    const inputUsername = document.getElementById("input-username");
    const inputEmail = document.getElementById("input-email");
    const inputPassword = document.getElementById("input-password");

    const usernameValue = inputUsername.value.trim();
    const emailValue = inputEmail.value.trim();
    const passwordValue = inputPassword.value.trim();

    // Validação básica se todos os campos estão preenchidos
    const entryValid = usernameValue && emailValue && passwordValue;

    if (entryValid) {
        // Envia o payload batendo certinho com o seu record LoginRequest do backend
        const response = await registerUser({ 
            email: emailValue, 
            username: usernameValue, 
            password: passwordValue, 
            isAdmin: false
        });
        
        window.location.href = "/pages/admin/users.html";
    } 
    else {
        checkEntry();
    }
});

function checkEntry() {
    const inputs = document.querySelectorAll(".input");
    
    inputs.forEach(input => {
        let isInvalid = false;

        // Se for o campo de e-mail, valida a estrutura do e-mail
        if (input.type === "email") {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            if (input.value === "" || !validEmail) {
                isInvalid = true;
            }
        } 
        // Para os outros campos (text/password), valida apenas se está vazio
        else {
            if (input.value.trim() === "") {
                isInvalid = true;
            }
        }

        // Aplica a classe visual de erro se o campo falhar na validação
        if (isInvalid) {
            input.classList.add("input-invalid");
            
            // Remove a borda vermelha assim que o usuário clicar de volta no input
            input.addEventListener("click", () => {
                input.classList.remove("input-invalid");
            });
        }
    });
}