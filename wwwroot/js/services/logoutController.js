import { logoutUser } from '../api/authApi.js';

const btnLogout = document.getElementById("btn-logout");
btnLogout.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await logoutUser();

        window.location.href = '/pages/admin/login.html';

    } catch (error) {
        alert("Erro ao sair da conta!");
    }
});
