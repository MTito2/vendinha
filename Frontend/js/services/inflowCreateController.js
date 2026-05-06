import { getPlaces } from "../api/placeApi.js";

export class InflowCreateView {
    constructor() {
        this.cellEmpty = true
        this.places = []
    }

    async loadInflowView() {
        this.places = await getPlaces();
        this.renderTable();
    }

    renderTable() {
        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");
        const row = document.createElement("tr")
        
        for (let index = 0; index < 4; index++) {
            const cell = document.createElement("td")
            cell.classList.add("table-cell", "align-middle", "text-center")
            cell.setAttribute("contenteditable", "true");

            if (index === 3) {
                const select = this.createSelectEl(); 
                cell.appendChild(select)
                cell.setAttribute("contenteditable", "false")
            }
            
            row.appendChild(cell)
        }

        table.appendChild(tableBody)
        tableBody.appendChild(row)

        this.btnNewProductListener();
        this.btnSaveListener();
        this.cellListener();
    }

    btnNewProductListener () {
        const btnNewProduct = document.getElementById("btn-new-product")
        const tableBody = document.querySelector("tbody")

        btnNewProduct.addEventListener("click", () => {
            const row = document.createElement("tr")

            for (let index = 0; index < 4; index++) {
                const cell = document.createElement("td")
                cell.classList.add("table-cell", "align-middle", "text-center")
                cell.setAttribute("contenteditable", "true")

                if (index === 3) {
                    const select = this.createSelectEl(); 
                    cell.appendChild(select)
                    cell.setAttribute("contenteditable", "false")
                }

                row.appendChild(cell)
            }

            tableBody.append(row)

            const firstCell = row.firstElementChild
            firstCell.focus()
        })
    }

    btnSaveListener () {
        const btnSave = document.getElementById("btn-save")
        btnSave.addEventListener("click", () => {
            this.checkCellEmpty();
        })
    }

    cellListener () {
        document.addEventListener("click", (e) => {
            const cell = e.target.classList.contains("table-cell") ? e.target : null

            if (cell !== null) {
                if (cell.classList.contains("empty-cell")) {
                    cell.classList.remove("empty-cell")
                }
            }
        })
    }

    checkCellEmpty () {
        const cells = document.querySelectorAll(".table-cell")

        cells.forEach(cell => {
            if (cell.textContent === "") {
                cell.classList.add("empty-cell")
            }
            else {
                cell.classList.remove("empty-cell")
            }

        });
    }

    createSelectEl () {
        const select = document.createElement("select")
        select.classList.add("form-select", "form-select-sm", "mx-auto") 

        const option = document.createElement("option");
        option.textContent = "Selecione...";
        option.disabled = true;
        option.selected = true;

        select.appendChild(option)

        this.places.forEach(place => {
            const option = document.createElement("option");
            option.textContent = place.name
            option.value = place.id
            select.appendChild(option)
        });

        console.log(select)

        return select
    }
}