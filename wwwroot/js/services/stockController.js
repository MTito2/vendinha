import { getStockForPlace} from "../api/stockApi.js";
import { getPlaces} from "../api/placeApi.js";

const API_URL = window.APP_CONFIG.API_URL;

export class StockView {
    constructor() {
        this.stock = [];
        this.placesInDb = [];
        this.placeId = 0;

    }

    async loadStock() {
        this.placesInDb = await getPlaces();
        this.renderSelectEl();
        this.renderTable();
        this.selectListener();
    }

    renderTable() {
        const existingTbody = document.querySelector("#table tbody");
        if (existingTbody) {
            existingTbody.remove();
        }

        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");

        for (const item of this.stock) {
            const tableRow = document.createElement("tr");
            tableRow.setAttribute("id", item.id);
            const tableDataProduct = document.createElement("td");
            const tableDataQuantity = document.createElement("td");
            tableDataQuantity.dataset.type = "quantity";

            tableDataProduct.textContent = item.product.name;
            tableDataQuantity.textContent = item.currentQuantity;

            tableRow.appendChild(tableDataProduct);
            tableRow.appendChild(tableDataQuantity);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
    }

    renderSelectEl () {
        const main = document.querySelector("main")
        const select = document.createElement("select")
        select.setAttribute("id", "select-place-stock")
        select.classList.add("form-select", "form-select-sm", "mt-4") 

        const option = document.createElement("option");
        option.textContent = "Selecione um local...";
        option.disabled = true;
        option.selected = true;

        select.appendChild(option)

        this.placesInDb.forEach(place => {
            const option = document.createElement("option");
            option.textContent = place.name
            option.value = place.id
            select.appendChild(option)
        });

        main.prepend(select); 
    }

    colorizeLowStock() {
        const rows = document.querySelectorAll("#table tbody tr");

        rows.forEach(row => {
            const quantityCell = row.querySelector('td[data-type="quantity"]');

            const quantity = parseInt(quantityCell.textContent);

            if (quantity <= 5) {
                row.classList.add("table-danger");
            }
            else if (quantity > 5 && quantity <= 10) {
                row.classList.add("table-warning");
            }
        });
    }

    selectListener () {
        const select = document.querySelector("select")
        
        select.addEventListener("change",async () => {
            this.placeId = select.value;
            this.stock = await getStockForPlace(this.placeId);

            this.stock.sort((a, b) =>
                a.product.name.localeCompare(b.product.name)
            )

            this.renderTable();
            this.colorizeLowStock();
        })

    }   
}