
export class NfsView {
    constructor() {
        this.table = null;
    }

    async nfsLoad() {
        this.renderTable();
        this.btnFileListener();
    }

    renderTable() {
        const rows = [[
            `
        <input 
            type="checkbox" 
            class="form-check-input check-item"
        >
        `,

            `
        <label class="btn-upload">
            Anexar arquivo
            <input type="file" class="d-none input-file">
        </label>

        <span class="file-name">
            Nenhum arquivo
        </span>
            `,

            `
        <select class="form-select form-select-sm">
            <option selected disabled>
                Selecione...
            </option>

            <option value="Entrada">
                Entrada
            </option>

            <option value="Saida">
                Saída
            </option>
        </select>
        `,

            `
        <input 
            type="number" 
            class="form-control form-control-sm"
            placeholder="R$ 0,00"
        >
        `,

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
        ]];

        if (this.table) {
            this.table.clear();
            this.table.rows.add(rows);
            this.table.draw();
            return;
        }

        this.table = new DataTable('#table', {
            data: rows,

            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
            },

            columnDefs: [
                { targets: "_all", orderable: false }
            ]
        });
    }

    createSelectEl() {
        const select = document.createElement("select")
        select.classList.add("form-select", "form-select-sm", "mx-auto")

        const optionMain = document.createElement("option");
        optionMain.textContent = "Selecione...";
        optionMain.disabled = true;
        optionMain.selected = true;

        select.appendChild(optionMain)

        const option1 = document.createElement("option");
        option1.textContent = "Entrada";
        option1.value = "Entrada";
        select.appendChild(option1)

        const option2 = document.createElement("option");
        option2.textContent = "Saída";
        option2.value = "Saída";
        select.appendChild(option2)

        return select
    }

    btnFileListener() {
        document.addEventListener("change", (e) => {
            if (e.target.classList.contains("input-file")) {

                const file = e.target.files[0];

                const td = e.target.closest("td");

                const fileName = td.querySelector(".file-name");

                fileName.textContent = file
                    ? file.name
                    : "Nenhum arquivo";
            }
        });


    }
}