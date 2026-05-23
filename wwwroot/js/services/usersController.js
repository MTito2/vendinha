import { getUsers } from "../api/authApi.js";

const API_URL = window.APP_CONFIG.API_URL;

export class UsersView {
    constructor() {
        this.users = [];
    }

    async loadUsers() {
        this.users = await getUsers();
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

            tableDataEmail.textContent = user.email;

            tableRow.appendChild(tableDataEmail);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
    }
}