import { getPlaces } from "../api/placeApi.js";

export class InflowCreateView {
    constructor() {
        this.cellEmpty = true
        this.places = []
    }

    async loadInflowView() {
        this.renderTable();
        this.places = await getPlaces();
    }

    renderTable() {
        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");
        const row = document.createElement("tr")
        
        for (let index = 0; index < 4; index++) {
            const cell = document.createElement("td")
            cell.classList.add("table-cell", "align-middle", "text-center")
            cell.setAttribute("contenteditable", "true");
            
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
}