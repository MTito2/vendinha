import { loginUser } from '../api/authApi.js';

const btnLogin = document.getElementById("btn-login");
btnLogin.addEventListener("click", async (event) => {
    event.preventDefault();

    const emailEntry = document.getElementById("input-user").value; 
    const passwordEntry = document.getElementById("input-password").value;

    const emailValue = document.getElementById("input-user").value;
    const passwordValue = document.getElementById("input-password").value;

    const entryValid = emailValue && passwordValue

    if (!entryValid) {
        checkEntry();
        return;
    }   
        try { 
        await loginUser({ 
            email: emailEntry, 
            password: passwordEntry 
        });

        window.location.href = '/pages/admin/home.html';
       }   

        catch (error) {
            console.error("Error logging in:", error);
            alert("Login falhou. Verifique suas credenciais e tente novamente.");
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