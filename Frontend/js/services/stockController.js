import { getStockForPlace} from "../api/stockApi.js";

const API_URL = window.APP_CONFIG.API_URL;

export class StockView {
    constructor() {
        this.stock = [];
        this.placesDropdown = [];
        this.activePlaceId = 1;
    }

    async loadStock() {
        this.stock = await getStockForPlace(this.activePlaceId);
        this.placesDropdown = ["Campo Grande"];
        console.log(this.stock);
        this.renderTable();
        this.initDropdownButton();
        this.placeDropdownConfig();
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

            tableDataProduct.textContent = item.product.name;
            tableDataQuantity.textContent = item.currentQuantity;

            tableRow.appendChild(tableDataProduct);
            tableRow.appendChild(tableDataQuantity);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
    }

    placeDropdownConfig() {
            const dropdownMenu = document.getElementById("dropdown-menu");
            const btnPlace = document.getElementById("btn-place");
            const btnTextPlace = document.getElementById("btn-text-place");
    
            dropdownMenu.innerHTML = "";
    
            this.placesDropdown.forEach(place => {
                const dropdownItem = document.createElement("p");
                const arrowImg = document.getElementById("arrow-img");
    
    
                dropdownItem.classList.add("place-name");
                dropdownItem.textContent = place;
    
                dropdownItem.addEventListener("click", async () => {
    
                    this.activePlaceId = dropdownItem.textContent === "Doutor" ? 1 : dropdownItem.textContent === "Campo Grande" ? 2 : 0;
                    this.stock = await getStockForPlace(this.activePlaceId);
                    const tableBody = document.getElementById("table-body");
                    if (tableBody) {
                        tableBody.remove();
                    }
                    this.renderTable();
    
                    let placeActive = btnPlace.textContent.trim();
                    dropdownItem.textContent = placeActive;
    
                    btnTextPlace.textContent = place;
    
                    this.placesDropdown.push(placeActive);
                    const activeIndex = this.placesDropdown.indexOf(place);
                    this.placesDropdown.splice(activeIndex, 1);
    
                    this.placesDropdown.sort();
                    dropdownMenu.classList.remove("show"); 
                    arrowImg.classList.remove("rotate");
                    this.placeDropdownConfig();
                });
    
                dropdownMenu.appendChild(dropdownItem);
            });
        }

        initDropdownButton() {
            const btnPlace = document.getElementById("btn-place");
            const dropdownMenu = document.getElementById("dropdown-menu");
            const arrowImg = document.getElementById("arrow-img");

            btnPlace.addEventListener("click", () => {
                dropdownMenu.classList.toggle("show");
                arrowImg.classList.toggle("rotate");
            });
    }

   
}