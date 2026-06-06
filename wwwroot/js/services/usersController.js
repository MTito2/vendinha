import { getUsers } from "../api/authApi.js";
import { deleteUser } from "../api/authApi.js";

const API_URL = window.APP_CONFIG.API_URL;

export class UsersView {
    constructor() {
        this.users = [];
    }

    async loadUsers() {
        this.users = await getUsers();
        this.users.sort((a, b) => a.email.localeCompare(b.email));
        this.renderTable();
    }

    renderTable() {
        const existingTbody = document.querySelector("#table tbody");
        if (existingTbody) {
            existingTbody.remove();
        }

        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");

        for (const user of this.users) {
            const tableRow = document.createElement("tr");
            tableRow.setAttribute("id", user.id);
            const tableDataUsername = document.createElement("td");
            tableDataUsername.setAttribute("data-label", "Username");
            tableDataUsername.textContent = user.username;
            tableRow.appendChild(tableDataUsername);
            const tableDataEmail = document.createElement("td");
            tableDataEmail.setAttribute("data-label", "Email");
            const tableDataAdmin = document.createElement("td");
            tableDataAdmin.setAttribute("data-label", "Administrador");
            const tableDataActions = document.createElement("td");

            console.log("Renderizando usuário:", user); // Log para verificar os dados do usuário
            
            tableDataUsername.textContent = user.userName;
            tableDataEmail.textContent = user.email;
            tableDataAdmin.textContent = user.isAdmin ? "Sim" : "Não";
            tableDataActions.innerHTML = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#667085"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="edit-icon lucide lucide-pencil-icon lucide-pencil"
                >
                <path
                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                />
                <path d="m15 5 4 4" />
            </svg>

            <button type="button" class="btn-trash">
                <svg class="icon-trash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#464d5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            `;

            tableRow.appendChild(tableDataUsername);
            tableRow.appendChild(tableDataEmail);
            tableRow.appendChild(tableDataAdmin);
            tableRow.appendChild(tableDataActions);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
        this.updateActiveListener();
        this.btnTrashListener();
    }

    updateActiveListener() {
        const editActions = document.querySelectorAll(".edit-icon");

        editActions.forEach(edit => {
            edit.addEventListener("click", async () => {
                const row = edit.closest("tr");
                const id = row.getAttribute("id");

                localStorage.setItem("userId", id);
                localStorage.setItem("userUsername", row.querySelector("td[data-label='Username']").textContent);
                localStorage.setItem("userEmail", row.querySelector("td[data-label='Email']").textContent);
                localStorage.setItem("userIsAdmin", row.querySelector("td[data-label='Administrador']").textContent);

                window.location.href = "/pages/admin/users_edit.html";
            });
        });
    }
    btnTrashListener() {
        const deleteActions = document.querySelectorAll(".btn-trash");

        const modalElement = document.getElementById("modalImg");
        const bootstrapModal = new bootstrap.Modal(modalElement);

        const modalBody = document.getElementById("modal-body");
        const btnConfirm = document.getElementById("btn-confirm");
        const containerErroMain = document.getElementById("container-erro-main");

        // Variáveis de controle para guardar o que foi clicado
        let idParaDeletar = null;
        let linhaParaRemover = null;

        // 1. O botão de confirmar ganha o evento UMA ÚNICA VEZ (fora do loop)
        if (btnConfirm) {
            btnConfirm.addEventListener("click", async () => {
                if (!idParaDeletar || !linhaParaRemover) return;

                try {
                    // Tenta deletar no back-end
                    await deleteUser(idParaDeletar);

                    // Se der certo, remove a linha e fecha o modal
                    linhaParaRemover.remove();
                    bootstrapModal.hide();

                } catch (error) {
                    console.error("Erro ao deletar usuário:", error);

                    // Se o back-end recusar (ex: único admin), exibe o erro no main
                    if (containerErroMain) {
                        containerErroMain.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" style="min-width: 24px;">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                            <div>
                                <strong>Atenção:</strong> Não é possível excluir o único administrador do sistema!
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    }

                    // Fecha o modal mesmo dando erro, para o usuário ver o alerta no main
                    bootstrapModal.hide();
                }
            });
        }

        // 2. O loop das lixeiras apenas "alimenta" as variáveis e abre o modal
        deleteActions.forEach(deleteBtn => {
            deleteBtn.addEventListener("click", () => {
                linhaParaRemover = deleteBtn.closest("tr");
                idParaDeletar = linhaParaRemover.getAttribute("id");

                // Limpa erros antigos da tela ao abrir o modal para um novo usuário
                if (containerErroMain) containerErroMain.innerHTML = "";

                // Restaura o texto do modal padrão
                if (modalBody) {
                    modalBody.innerHTML = `<p>Tem certeza que deseja excluir este usuário?</p>`;
                }

                // Abre o modal
                bootstrapModal.show();
            });
        });
    }
}