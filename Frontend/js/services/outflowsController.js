import { getOutflows } from "../api/outflowApi.js";

export class OutflowsView {
    constructor() {
        this.outflows = [];
    }

    async loadOutflows() {
        this.outflows = await getOutflows();
        this.render();
    }

    render() {
        const tableBody = document.createElement("tbody");
        const table = document.getElementById("table");

        for (const outflow of this.outflows) {
            const tableRow = document.createElement("tr");
            const tableDataDate = document.createElement("td");
            const tableDataClientName = document.createElement("td");
            const tableDataProduct = document.createElement("td");
            const tableDataPrice = document.createElement("td");
            const tableDataQuantity = document.createElement("td");
            const tableDataBtnTrash = document.createElement("td");

            tableRow.setAttribute("id", outflow.id);
            tableDataDate.textContent = this.formatDate(outflow.date);
            tableDataClientName.textContent = outflow.clientName;
            tableDataProduct.textContent = outflow.product.name;
            tableDataPrice.textContent = this.formatPrice(outflow.product.price);
            tableDataQuantity.textContent = outflow.quantity;
            tableDataBtnTrash.innerHTML = `
            <button class="btn-trash">
                <svg 
                class="icon-trash" 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#464d5c" 
                stroke-width="2"
                stroke-linecap="round" 
                stroke-linejoin="round"
                >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            `;

            tableRow.appendChild(tableDataDate);
            tableRow.appendChild(tableDataClientName);
            tableRow.appendChild(tableDataProduct);
            tableRow.appendChild(tableDataPrice);
            tableRow.appendChild(tableDataQuantity);
            tableRow.appendChild(tableDataBtnTrash);

            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);

    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours() - 3).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0'); 
        const seconds = String(date.getSeconds()).padStart(2, '0');    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    formatPrice(price) {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}