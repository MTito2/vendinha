import { getOutflows } from "../api/outflowApi.js";
import { deleteOutflow } from "../api/outflowApi.js";
import { formatPrice } from "../utils/formatPrice.js";

export class OutflowsView {
    constructor() {
        this.outflows = [];
        this.currentMonth = "";
        this.currentYear = "";
        this.table = null;
    }

    async loadOutflows() {
        this.currentMonth = new Date().getMonth() + 1
        this.currentYear = new Date().getFullYear()
        this.outflows = await getOutflows(this.currentMonth, this.currentYear);
        
        this.renderDateName();
        this.renderTable();
        this.dateInputListener();
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
        const rows = this.outflows.map(outflow => [
            this.formatDate(outflow.date),
            outflow.clientName,
            outflow.product.name,
            formatPrice(outflow.product.price),
            outflow.quantity,
            outflow.place.name,
            `
            <button class="btn-trash">
                <svg 
                    class="icon-trash" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#464d5c" 
                    stroke-width="2"
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                >
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            `
        ])

        if (this.table) {
            this.table.clear()
            this.table.rows.add(rows)
            this.table.draw()

            this.btnTrashListener()

            return
        }

        this.table = new DataTable('#table', {
            data: rows,

            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
            },

            columnDefs: [
                {
                    orderable: false,
                    targets: [6]
                }
            ],

            createdRow: (row, data, dataIndex) => {
                row.setAttribute("id", this.outflows[dataIndex].id)
            }
        })

        this.btnTrashListener()
    }

    btnTrashListener() {
        const btnTrash = document.querySelectorAll(".btn-trash");
        btnTrash.forEach(btn => {
            btn.addEventListener("click", () => {
                console.log("clicou");
                const row = btn.closest("tr");
                const id = parseInt(row.getAttribute("id"));

                deleteOutflow(id);
                row.remove();
            });
        });
    }

    dateInputListener() {
        const dateInputListener = document.getElementById("date-input")
        dateInputListener.addEventListener("blur", async () => {
            const selectedMonth = dateInputListener.dataset.month
            const selectedYear = dateInputListener.dataset.year

            if (selectedMonth && selectedYear) {
                this.outflows = await getOutflows(selectedMonth, selectedYear) 
                this.renderTable();
            }
        })
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