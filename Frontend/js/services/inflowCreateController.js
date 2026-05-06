import { getPlaces } from "../api/placeApi.js";

export class InflowCreateView {
    constructor() {
        this.places = []
    }

    async loadInflowView() {
        this.places = await getPlaces();
        this.renderTable();
    }

    renderTable() {
        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");
        const row = this.createRowElement();
        tableBody.appendChild(row)
        table.appendChild(tableBody)
        
        this.btnNewProductListener();
        this.btnSaveListener();
        this.cellListener();
        this.checkTypeInput();
    }

    btnNewProductListener () {
        const btnNewProduct = document.getElementById("btn-new-product")
        const tableBody = document.querySelector("tbody")

        btnNewProduct.addEventListener("click", () => {
            const row = this.createRowElement();
            tableBody.append(row)

            const firstCell = row.firstElementChild
            firstCell.focus()
            this.checkTypeInput()
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

            if (cell.dataset.col.includes("place")) {
                const select = cell.querySelector("select")

                if (select.value === "Selecione...") {
                    select.classList.add("select-empty")
                }

                else {
                    select.classList.remove("select-empty")
                }
            }

        });
    }

    checkTypeInput() {
        const cells = document.querySelectorAll(".table-cell")
        cells.forEach(cell => {
            if (cell.dataset.col.includes("price") || cell.dataset.col.includes("quantity")) {
                cell.addEventListener("beforeinput", (e) => {
                    if (e.data && !/^\d+$/.test(e.data)) {
                        e.preventDefault(); 
                    }
                })
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

        return select
    }

    createRowElement () {
        const row = document.createElement("tr")
        
        for (let index = 0; index < 4; index++) {
            const cell = document.createElement("td")
            const cellData = index === 0 ? "product": index === 1 ? "price" : index === 2 ? "quantity" : index === 3 ?  "place" : null
            cell.dataset.col = cellData
            cell.classList.add("table-cell", "align-middle", "text-center")
            cell.setAttribute("contenteditable", "true");

            if (index === 3) {
                const select = this.createSelectEl(); 
                cell.appendChild(select)
                cell.setAttribute("contenteditable", "false")
            }
            
            row.appendChild(cell)
        }
        return row

    }
}