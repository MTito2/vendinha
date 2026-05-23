import { getPlaces } from "../api/placeApi.js";
import { sendInflow } from "../api/inflowApi.js";


export class InflowCreateView {
    constructor() {
        this.places = []
        this.invalidEntry = true
    }

    async loadInflowView() {
        this.places = await getPlaces();
        this.renderTable();
    }

    renderTable() {
        const tableBodyExisting = document.querySelector("tbody")
        if (tableBodyExisting) {
            tableBodyExisting.innerHTML = ""
        }

        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");

        tableBody.setAttribute("id", "tbody")
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
        const main = document.querySelector("main");

        const btnSave = document.getElementById("btn-save")
        btnSave.addEventListener("click", () => {
            this.checkCellEmpty();
            this.checkEntryInvalid();


            if (this.invalidEntry === false) {
                try {
                    this.compileInflows()
                    this.renderTable()
                    const alertDiv = this.createAlertElement("sucess");
                    main.append(alertDiv)
                    alertDiv.style.display = "block";

                    setTimeout(() => {
                        alertDiv.style.display = "none";
                        window.location.href = "/pages/admin/inflows_history.html"
                    }, 700); 

                }
                catch (error) {
                    const alertDiv = this.createAlertElement("error");
                    main.append(alertDiv)
                    alertDiv.style.display = "block";

                    setTimeout(() => {
                        alertDiv.style.display = "none";
                    }, 3000); 

                    console.log(error)
                }
            }
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

    compileInflows () {
        const tbody = document.getElementById("tbody");
        const rows = tbody.querySelectorAll("tr")

        rows.forEach( async row => {
            const cells = row.querySelectorAll("td")
            const select = cells[3].querySelector("select") 

            const date = new Date().toISOString()
            const price = parseFloat(cells[1].textContent.replace(",", "."))
            const quantity = parseInt(cells[2].textContent)
            const placeId = parseInt(select.value)
            
            const data = {
                "date": date,
                "productId": 0,
                "productName": cells[0].textContent,
                "price": price,
                "quantity": quantity,
                "placeId": placeId
            }

            await sendInflow(data)
        });
    }

    checkEntryInvalid () {
        const cells = document.querySelectorAll(".table-cell")
        const selects = document.querySelectorAll("select")
        
        let counterInvalidSelect = 0
        let counterInvalidCell = 0

        cells.forEach(cell => {
            if(cell.classList.contains("empty-cell")) {
                counterInvalidCell ++
            }
        });

       selects.forEach(select => {
            if(select.classList.contains("empty-select")) {
                counterInvalidSelect ++
            }
        });

        this.invalidEntry = counterInvalidCell > 0  || counterInvalidSelect > 0 ? true : false 
    }

    checkCellEmpty () {
        const cells = document.querySelectorAll(".table-cell")
        
        cells.forEach(cell => {
            const select = cell.querySelector("select")

            if (cell.textContent === "") {
                cell.classList.add("empty-cell")
            }
            else {
                cell.classList.remove("empty-cell")
            }

            if (cell.dataset.col.includes("place")) {
                if (select.value === "Selecione...") {
                    select.classList.add("empty-select")
                }
                else {
                    select.classList.remove("empty-select")
                }
            }
        });
    }

    checkTypeInput() {
        const cells = document.querySelectorAll(".table-cell")
        cells.forEach(cell => {
            if (cell.dataset.col.includes("price")) {
                cell.addEventListener("beforeinput", (e) => {
                    const regex = /[\d,]/
                    if (e.data && regex.test(e.data) === false) {
                        e.preventDefault(); 
                    }
                })
            } 

            if (cell.dataset.col.includes("quantity")) {
                cell.addEventListener("beforeinput", (e) => {
                    const regex = /[\d]/
                    if (e.data && regex.test(e.data) === false) {
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

    createAlertElement (type) {
        const alertDiv = document.createElement("div");

        if (type === "sucess") {
            alertDiv.className = "alert alert-sucess position-absolute text-center m-3 p-2";
            alertDiv.id = "alert-div-sucess";
            alertDiv.style.display = "none";
            alertDiv.textContent = "Produtos adicionados com sucesso.";
        }

        else if (type === "error") {
            alertDiv.className = "alert alert-danger position-absolute text-center p-2";
            alertDiv.id = "alert-div-error";
            alertDiv.style.display = "none";
            alertDiv.textContent = "Houve um erro.";
        }

        return alertDiv
    }
}