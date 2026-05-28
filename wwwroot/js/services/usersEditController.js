import { editUser } from "../api/authApi.js";

const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

const inputEmail = document.getElementById("input-email")
const inputPassword = document.getElementById("input-password")

inputEmail.value = userEmail;
inputPassword.value = "";

document.getElementById("input-email").value = userEmail;

document.getElementById("btn-send").addEventListener("click", async (event) => {
    event.preventDefault();
    const inputEmail = document.getElementById("input-email")
    const inputPassword = document.getElementById("input-password")

    const emailValue = inputEmail.value
    const passwordValue = inputPassword.value

    const email = inputEmail.value;
    const password = inputPassword.value;

    try {
        if (!email) {
            console.log("Entrou no if do email vazio");
            const response = await editUser(userId, { password });
        }
        else if (!password) {
            console.log("Entrou no if do password vazio");
            const response = await editUser(userId, { email });
        }
        else {
            const response = await editUser(userId, { email, password });
        }

        window.location.href = "/pages/admin/users.html";

    }
    catch (error) {
        console.error("Erro ao editar usuário:", error);
        alert("Ocorreu um erro ao editar o usuário. Lembrando que a senha deve conter letra maiúscula, letra minúscula, número e caractere especial. Tente novamente.");
        return;
    }

}) 