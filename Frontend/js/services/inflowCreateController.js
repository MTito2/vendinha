
export class InflowCreateView {
    constructor() {
        this.cellEmpty = true
    }

    async loadInflowView() {
        this.renderTable();
    }

    renderTable() {
        this.btnNewProductListener();
        this.btnSaveListener();
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

    checkCellEmpty () {
        const cells = document.querySelectorAll(".table-cell")


        cells.forEach(cell => {
            if (cell.textContent === "") {
                cell.classList.add("empty-cell")
            }
            else {
                cell.classList.remove("cell-empty")
            }



        });
    }
}