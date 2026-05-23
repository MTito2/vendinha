import { loginUser } from '../api/authApi.js';

const btnLogin = document.getElementById("btn-login");
btnLogin.addEventListener("click", async (event) => {
    event.preventDefault();

    const emailEntry = document.getElementById("input-user").value; 
    const passwordEntry = document.getElementById("input-password").value;

    try {
        await loginUser({ 
            email: emailEntry, 
            password: passwordEntry 
        });

        window.location.href = '/pages/admin/home.html';

    } catch (error) {
        alert("E-mail ou senha incorretos!");
    }
});