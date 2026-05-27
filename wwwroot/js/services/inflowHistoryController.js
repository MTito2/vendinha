import { getInflows } from "../api/inflowApi.js";
import { formatPrice} from "../utils/formatPrice.js"
import { generateReport } from "../utils/reportConfig.js";

export class InflowsHistoryView {
    constructor() {
        this.inflows = []
        this.currentMonth = "";
        this.currentYear = "";
        this.table = null;
    }

    async loadInflowView() {
        this.currentMonth = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();

        this.renderDateName();
        this.btnReportListener();
        this.dateInputListener();

        await this.activeSpinner();
    }

    async btnReportListener() {
        const btnReport = document.getElementById("btn-download");
        const data = await getInflows(); 

        btnReport.addEventListener("click", async () => {
            await generateReport(data, "inflows", "vendinha_relatorio_de_entradas");
        });
    }

    renderDateName () {
        let monthName = new Date(this.currentYear, this.currentMonth - 1).toLocaleString('pt-BR', {
            month: 'long'
        })
        
        monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
        
        const dateInputListener = document.getElementById("date-input")
        const dateName = `${monthName} ${this.currentYear}`
        dateInputListener.value = dateName
    }


    renderTable() {
        const rows = this.inflows.map(inflows => [
            this.formatDate(inflows.date),
            inflows.product.name,
            formatPrice(inflows.product.price),
            inflows.quantity,
            inflows.place.name])

        if (this.table) {
            this.table.clear()
            this.table.rows.add(rows)
            this.table.draw()
            return
        }

        this.table = new DataTable('#table', {
            data: rows,
            order: [[0, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
            },

            createdRow: (row, data, dataIndex) => {
                row.setAttribute("id", this.inflows[dataIndex].id)
            }
        })
    }

    dateInputListener() {
        const dateInputListener = document.getElementById("date-input");

        dateInputListener.addEventListener("blur", async () => {
            const selectedMonth = dateInputListener.dataset.month;
            const selectedYear = dateInputListener.dataset.year;

            if (selectedMonth && selectedYear) {
                await this.activeSpinner(
                    selectedMonth,
                    selectedYear
                );
            }
        });
    }

    async activeSpinner(month = this.currentMonth, year = this.currentYear) {
        const tableContainer = document.querySelector(".table-container");
        const btnGroup = document.querySelector(".btn-wrapper");
        btnGroup.classList.remove("d-flex");

        if (this.table) {
            this.table.clear().draw();
            this.table.destroy();
            this.table = null;
        }

        tableContainer.querySelector(".sk-chase")?.remove();
        tableContainer.style.display = "none";
        btnGroup.style.display = "none";


        const chase = document.createElement("div");
        chase.className = "sk-chase";

        for (let i = 0; i < 6; i++) {
            chase.insertAdjacentHTML(
                "beforeend",
                '<div class="sk-chase-dot"></div>'
            );
        }

        tableContainer.appendChild(chase);

        try {
            const [inflows] = await Promise.all([
                getInflows(month, year),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);

            this.inflows = inflows;
            this.renderTable();

        } catch (error) {
            console.error(error);
        } finally {
            chase.remove();
            tableContainer.style.display = "flex";
            btnGroup.style.display = "flex";
        }
    }
            

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0'); 
        const seconds = String(date.getSeconds()).padStart(2, '0');    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
}