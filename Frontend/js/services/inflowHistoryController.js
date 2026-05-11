import { getInflows } from "../api/inflowApi.js";
import { formatPrice} from "../utils/formatPrice.js"

export class InflowsHistoryView {
    constructor() {
        this.inflows = []
    }

    async loadInflowView() {
        this.inflows = await getInflows();
        this.renderTable();
    }

    renderTable() {
        const tableBody = document.createElement("tbody");
        tableBody.setAttribute("id", "table-body");
        const table = document.getElementById("table");

        for (const inflow of this.inflows) {
            const tableRow = document.createElement("tr");
            const tableDataDate = document.createElement("td");
            const tableDataProduct = document.createElement("td");
            const tableDataPrice = document.createElement("td");
            const tableDataQuantity = document.createElement("td");
            const tableDataPlace = document.createElement("td");

            tableRow.setAttribute("id", inflow.id);
            tableDataDate.textContent = this.formatDate(inflow.date);
            tableDataProduct.textContent = inflow.product.name;
            tableDataPrice.textContent = formatPrice(inflow.product.price);
            tableDataQuantity.textContent = inflow.quantity;
            tableDataPlace.textContent = inflow.placeId
    
            tableRow.appendChild(tableDataDate);
            tableRow.appendChild(tableDataProduct);
            tableRow.appendChild(tableDataPrice);
            tableRow.appendChild(tableDataQuantity);
            tableRow.appendChild(tableDataPlace);

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
}