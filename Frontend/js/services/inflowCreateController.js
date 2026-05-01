
export class InflowCreateView {
    constructor() {
        
    }

    async loadInflowView() {
        this.renderTable();
    }

    renderTable() {
        this.btnNewProductListener()
        
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
}