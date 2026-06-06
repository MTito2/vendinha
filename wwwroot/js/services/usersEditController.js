import { editUser } from "../api/authApi.js";

const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");
const userUsername = localStorage.getItem("userUsername"); // Trazendo o username do localStorage
const userIsAdmin = localStorage.getItem("userIsAdmin"); 

document.addEventListener("DOMContentLoaded", () => {
    const inputUsername = document.getElementById("input-username"); // Elemento do username adicionado
    const inputEmail = document.getElementById("input-email");
    const inputPassword = document.getElementById("input-password");
    const inputAdmin = document.getElementById("input-admin");
    const btnSend = document.getElementById("btn-send");
    const containerErroMain = document.getElementById("container-erro-main"); 

    // Preenche os campos se os valores existirem no localStorage
    if (inputUsername) inputUsername.value = userUsername || "";
    if (inputEmail) inputEmail.value = userEmail || "";
    if (inputPassword) inputPassword.value = "";

    if (inputAdmin && userIsAdmin !== null) {
        const valorLimpo = String(userIsAdmin).trim();

        if (valorLimpo === "Sim") {
            inputAdmin.value = "true";
        } else if (valorLimpo === "Não" || valorLimpo === "Nao") {
            inputAdmin.value = "false";
        }
    }

    if (btnSend) {
        btnSend.addEventListener("click", async (event) => {
            event.preventDefault();

            if (containerErroMain) containerErroMain.innerHTML = "";

            const username = inputUsername ? inputUsername.value.trim() : "";
            const email = inputEmail.value;
            const password = inputPassword.value;
            const isAdmin = inputAdmin.value === "true"; 

            const updateData = { isAdmin };

            try {
                // Inclui as propriedades no payload se elas tiverem valor
                if (username) updateData.username = username;
                if (email) updateData.email = email;
                if (password) updateData.password = password;

                const response = await editUser(userId, updateData);

                // Atualiza o localStorage com os novos valores após o sucesso da API
                if (username) {
                    localStorage.setItem("userUsername", username);
                }
                if (email) {
                    localStorage.setItem("userEmail", email);
                }
                
                localStorage.setItem("userIsAdmin", inputAdmin.value === "true" ? "Sim" : "Não");

                // CONDICIONAL DE REDIRECIONAMENTO ADICIONADA:
                if (!isAdmin) {
                    window.location.href = "/pages/admin/home.html";
                } else {
                    window.location.href = "/pages/admin/users.html";
                }

           } catch (error) {
                console.error("Erro ao editar usuário:", error);
                
                if (!containerErroMain) return;

                // Captura os detalhes do erro vindo do seu Axios/Back-end
                const statusErro = error.response ? error.response.status : null;
                
                // Converte o objeto de erro para string e minúsculo para facilitar a busca por palavras-chave
                const mensagemApi = error.response && error.response.data 
                    ? JSON.stringify(error.response.data).toLowerCase() 
                    : "";

                // Estrutura básica do Alerta do Bootstrap
                let tituloErro = "Erro ao atualizar:";
                let textoErro = "Ocorreu um erro inesperado ao tentar atualizar o usuário. Tente novamente mais tarde.";

                // CONDICIONAL DE ERROS DETALHADA:
                
                // 1. Validação de DUPLICIDADE (E-mail ou Username já cadastrados)
                if (statusErro === 400 && (mensagemApi.includes("duplicate") || mensagemApi.includes("já existe") || mensagemApi.includes("já está em uso"))) {
                    tituloErro = "Dados Duplicados:";
                    
                    if (mensagemApi.includes("email")) {
                        textoErro = "O e-mail informado já está cadastrado em outra conta do sistema. Escolha um e-mail diferente.";
                    } else if (mensagemApi.includes("username")) {
                        textoErro = "O nome de usuário informado já está em uso. Escolha um nome de usuário único.";
                    } else {
                        textoErro = "O nome de usuário ou o e-mail informado já pertencem a outra conta ativa.";
                    }
                }
                // 4. Regra de negócio do único Administrador
                else {
                    tituloErro = "Alteração Negada:";
                    textoErro = "Não é possível remover os privilégios de administrador do usuário, pois ele é o único administrador ativo no sistema.";
                }

                // Injeta dinamicamente a mensagem correta com o estilo do Bootstrap na tela
                containerErroMain.innerHTML = `
                    <div class="alert alert-danger w-100 alert-dismissible fade show d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" style="min-width: 24px;">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <div>
                            <strong>${tituloErro}</strong> ${textoErro}
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }
        });
    }
});