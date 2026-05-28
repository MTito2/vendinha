import { getUsers } from "../api/authApi.js";

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
            const tableDataEmail = document.createElement("td");
            const tableDataActions = document.createElement("td");

            tableDataEmail.textContent = user.email;
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
            `;

            tableRow.appendChild(tableDataEmail);
            tableRow.appendChild(tableDataActions);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
        this.updateActiveListener();
    }

    updateActiveListener() {
        const editActions = document.querySelectorAll(".edit-icon");

        editActions.forEach(edit => {
            edit.addEventListener("click", async () => {
                const row = edit.closest("tr");
                const id = row.getAttribute("id");

                localStorage.setItem("userId", id);
                localStorage.setItem("userEmail", row.querySelector("td").textContent);

                window.location.href = "/pages/admin/users_edit.html";
            });
        });
    }

}