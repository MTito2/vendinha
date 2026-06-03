import { getInvoices } from "../api/nfsApi.js";
import { sendInvoiceData } from "../api/nfsApi.js";
import { uploadInvoice } from "../api/nfsApi.js";
import { editInvoiceData } from "../api/nfsApi.js";
import { deleteInvoice } from "../api/nfsApi.js";

export class NfsView {
    constructor() {
        this.table = null;
        this.invoices = [];
        this.formSubmitController = null;
    }

    async nfsLoad() {
        this.invoices = await getInvoices();
        this.renderTable();
        this.setupFormSubmit(); 
        this.setupModalReset(); 
        this.btnEditInvoice();
        this.btnDeleteInvoice();
        this.btnDownloadInvoice();   
        this.setupBulkActions();
        this.toggleBulkIcons();

        this.datepickerModal = new AirDatepicker('#invoiceDate', {
            container: '#modalInvoice',
            locale: {
                days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                today: 'Hoje',
                clear: 'Limpar',
                dateFormat: 'dd/MM/yyyy', 
                firstDay: 0
            },
            autoClose: true,
        });
    }

    renderTable() {
        this.invoices.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        const rows = this.invoices.map(invoice => Object.assign([
            `<input type="checkbox" class="form-check-input">`,
            new Date(invoice.date).toLocaleDateString('pt-BR'),
            `<a href="${invoice.urlPdf}" target="_blank" class="file-name">${invoice.desc}</a>`,
            invoice.type,
            invoice.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            `
            <button type="button" class="btn-download">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#464d5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>
            </button>

            <button type="button" class="btn-edit">
                <svg class="icon-edit" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#464d5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                </svg>
            </button>

            <button type="button" class="btn-trash">
                <svg class="icon-trash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#464d5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            `
        ], { DT_RowId: `${invoice.id}` }));

        if (this.table) {
            this.table.clear();
            this.table.rows.add(rows);
            this.table.draw();
            this.setupCheckAll(); // <-- REINICIALIZA OS EVENTOS DOS CHECKBOXES DA NOVA TABELA
            this.toggleBulkIcons(); // Garante o estado correto do container
            return;
        }

        this.table = new DataTable('#table', {
            data: rows,
            order: [],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
            },
            columnDefs: [
                { targets: [0, 5], orderable: false },
                { targets: [1, 4], orderable: true }
            ]
        });

        this.setupCheckAll(); // <-- INICIALIZA NA PRIMEIRA CRIAÇÃO DA TABELA
        this.toggleBulkIcons();
    }

    setupModalReset() {
        const btnAdd = document.getElementById('btn-add-invoice');
        if (!btnAdd) return;

        btnAdd.addEventListener('click', () => {
            document.getElementById('formInvoice').reset();
            document.getElementById('invoiceId').value = '';
            this.datepickerModal.clear();
            document.getElementById('modalInvoiceLabel').innerText = "Nova Nota Fiscal";
            document.getElementById('invoiceFile').required = true;
        });
    }

    btnEditInvoice() {
        document.getElementById('table').addEventListener('click', (event) => {
            const btnEdit = event.target.closest('.btn-edit');
            if (!btnEdit) return;

            event.preventDefault();
            event.stopPropagation();

            const tr = btnEdit.closest('tr');
            const id = tr.id;

            const invoice = this.invoices.find(item => item.id == id);
            if (invoice) {
                document.getElementById('invoiceId').value = invoice.id;
                document.getElementById('invoiceDate').value = new Date(invoice.date).toLocaleDateString('pt-BR');
                document.getElementById('invoiceDesc').value = invoice.desc;
                document.getElementById('invoiceType').value = invoice.type;
                document.getElementById('invoiceValue').value = invoice.value;

                if (invoice.date) {
                    this.datepickerModal.selectDate(new Date(invoice.date));
                } else {
                    this.datepickerModal.clear();
                }
                this.datepickerModal.update();

                document.getElementById('invoiceFile').value = '';
                document.getElementById('invoiceFile').required = false;

                document.getElementById('modalInvoiceLabel').innerText = "Editar Nota Fiscal";

                const modalElement = document.getElementById('modalInvoice');
                const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
                modalInstance.show();
            } else {
                console.error(`Nota fiscal com ID ${id} não encontrada na lista interna.`);
            }
        });
    }

    btnDeleteInvoice() {
        let idParaExcluir = null; 

        document.getElementById('table').addEventListener('click', (event) => {
            const btnTrash = event.target.closest('.btn-trash');
            if (!btnTrash) return;

            event.preventDefault();
            event.stopPropagation();

            const tr = btnTrash.closest('tr');
            idParaExcluir = tr.id; 

            const btnConfirmAction = document.getElementById('btn-confirm-delete-action');
            if (btnConfirmAction) delete btnConfirmAction.dataset.mode;

            const modalElement = document.getElementById('modalDeleteConfirm');
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
            modalInstance.show();
        });

        const btnConfirmAction = document.getElementById('btn-confirm-delete-action');
        if (btnConfirmAction) {
            btnConfirmAction.addEventListener('click', async () => {
                if (btnConfirmAction.dataset.mode === "bulk") {
                    const selecionados = document.querySelectorAll('#table tbody .form-check-input:checked');
                    const idsParaExcluir = Array.from(selecionados).map(cb => cb.closest('tr').id);

                    const modalElement = document.getElementById('modalDeleteConfirm');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    if (idsParaExcluir.length > 0) {
                        await this.handleBulkDelete(idsParaExcluir);
                    }
                    
                    delete btnConfirmAction.dataset.mode;
                    
                } else {
                    if (!idParaExcluir) return;

                    try {
                        await deleteInvoice(idParaExcluir);

                        const modalElement = document.getElementById('modalDeleteConfirm');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide();

                        this.invoices = await getInvoices();
                        this.renderTable();
                    } catch (error) {
                        console.error("Falha ao excluir nota:", error);
                        alert("Ocorreu um erro ao tentar excluir a nota fiscal.");
                    } finally {
                        idParaExcluir = null; 
                    }
                }
            });
        }
    }

    setupFormSubmit() {
    const form = document.getElementById('formInvoice');
    if (!form) return;

    // 1. Se já existia um listener ativo de um clique anterior, cancela ele
    if (this.formSubmitController) {
        this.formSubmitController.abort();
    }

    // 2. Cria um novo controlador para o listener atual
    this.formSubmitController = new AbortController();
    const { signal } = this.formSubmitController;

    // 3. Passamos o 'signal' nas opções do evento (no final do bloco)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('invoiceId').value;
        const fileInput = document.getElementById('invoiceFile');
        const file = fileInput.files[0];

        const rawValue = document.getElementById('invoiceValue').value.toString();
        const cleanValue = parseFloat(rawValue.replace(',', '.'));

        const selectedDateObj = this.datepickerModal.selectedDates[0];
        let dateISO = null;

        if (selectedDateObj) {
            const year = selectedDateObj.getFullYear();
            const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDateObj.getDate()).padStart(2, '0');
            dateISO = `${year}-${month}-${day}T23:59:00Z`;
        } else {
            const hoje = new Date();
            dateISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}T23:59:00Z`;
        }

        // Renomeado para invoicePayload para não dar conflito com o FormData de arquivos das outras funções
        const invoicePayload = {
            date: dateISO, 
            desc: document.getElementById('invoiceDesc').value,
            type: document.getElementById('invoiceType').value,
            value: cleanValue
        };

        if (id) {
            await this.handleEditInvoice(id, invoicePayload, file);
        } else {
            await this.handleSubmitInvoice(invoicePayload, fileInput);
        }

        const modalElement = document.getElementById('modalInvoice');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        this.invoices = await getInvoices();
        this.renderTable();
        
    }, { signal }); // 👈 Vincula esse evento ao sinal de aborto para evitar a duplicação!
}

    async handleSubmitInvoice(textData, fileInput) {
        try {
            console.log("Enviando dados de cadastro da nota...");
            const newInvoice = await sendInvoiceData(textData);
            const invoiceId = newInvoice.id;

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            console.log("Enviando arquivo PDF...");
            await uploadInvoice(invoiceId, formData);

        } catch (error) {
            console.error("Falha ao cadastrar nota:", error);
            alert("Ocorreu um erro ao enviar a nota.");
        }
    }

    async handleEditInvoice(id, textData, file) {
        try {
            console.log(`Editando nota fiscal de ID: ${id}...`);
            await editInvoiceData(id, textData, file);
        } catch (error) {
            console.error("Falha ao editar nota:", error);
            alert("Ocorreu um erro ao atualizar os dados da nota.");
        }
    }

    setupCheckAll() {
        const checkAll = document.getElementById('check-all');
        if (!checkAll) return;

        // Remove listeners antigos para não duplicar processamento na memória
        const newCheckAll = checkAll.cloneNode(true);
        checkAll.parentNode.replaceChild(newCheckAll, checkAll);

        newCheckAll.addEventListener('change', () => {
            const checkboxes = document.querySelectorAll('#table tbody .form-check-input');
            checkboxes.forEach(cb => {
                cb.checked = newCheckAll.checked;
            });
            this.toggleBulkIcons(); 
        });

        // Delegação de evento focada no corpo da tabela (funciona mesmo recriando linhas)
        const tbody = document.querySelector('#table tbody');
        if (tbody) {
            tbody.addEventListener('change', (event) => {
                if (event.target.classList.contains('form-check-input')) {
                    this.toggleBulkIcons(); 
                }
            });
        }
    }

    toggleBulkIcons() {
        const iconsContainer = document.querySelector('.icons-container');
        if (!iconsContainer) return;

        const marcados = document.querySelectorAll('#table tbody .form-check-input:checked').length;

        if (marcados > 0) {
            iconsContainer.style.display = 'flex'; 
        } else {
            iconsContainer.style.display = 'none'; 
            
            const checkAll = document.getElementById('check-all');
            if (checkAll) checkAll.checked = false;
        }
    }

    btnDownloadInvoice() {
        document.getElementById('table').addEventListener('click', async (event) => {
            const btnDownload = event.target.closest('.btn-download');
            if (!btnDownload) return;

            event.preventDefault();
            event.stopPropagation();

            const tr = btnDownload.closest('tr');
            const link = tr.querySelector('.file-name');

            if (link && link.href) {
                const nomeArquivo = link.textContent.trim() + ".pdf";
                await this.forcarDownloadPDF(link.href, nomeArquivo);
            } else {
                alert("Esta nota não possui arquivo PDF para download.");
            }
        });
    }

    setupBulkActions() {
        const btnDownloadSelected = document.getElementById('btn-download-selected');
        const btnDeleteSelected = document.getElementById('btn-delete-selected');

        if (btnDownloadSelected) {
            btnDownloadSelected.addEventListener('click', async () => {
                const selecionados = document.querySelectorAll('#table tbody .form-check-input:checked');
                if (selecionados.length === 0) return;

                for (const cb of selecionados) {
                    const tr = cb.closest('tr');
                    const link = tr.querySelector('.file-name');
                    if (link && link.href) {
                        const nomeArquivo = link.textContent.trim() + ".pdf";
                        await this.forcarDownloadPDF(link.href, nomeArquivo);
                    }
                }
            });
        }

        if (btnDeleteSelected) {
            btnDeleteSelected.addEventListener('click', () => {
                const selecionados = document.querySelectorAll('#table tbody .form-check-input:checked');
                if (selecionados.length === 0) return;

                const btnConfirmAction = document.getElementById('btn-confirm-delete-action');
                if (btnConfirmAction) {
                    btnConfirmAction.dataset.mode = "bulk"; 
                }

                const modalElement = document.getElementById('modalDeleteConfirm');
                const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
                modalInstance.show();
            });
        }
    }

    async forcarDownloadPDF(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Erro ao baixar o arquivo:", error);
            window.open(url, '_blank');
        }
    }

    async handleBulkDelete(ids) {
        try {
            console.log(`Iniciando exclusão em lote de ${ids.length} notas...`);
            
            for (const id of ids) {
                await deleteInvoice(id); 
            }

            const iconsContainer = document.querySelector('.icons-container');
            if (iconsContainer) iconsContainer.style.display = 'none'; // <-- CORRIGIDO: Removido style duplicado

            const checkAll = document.getElementById('check-all');
            if (checkAll) checkAll.checked = false;
            
            this.invoices = await getInvoices();
            this.renderTable();
            
        } catch (error) {
            console.error("Erro ao excluir alguma das notas em lote:", error);
            alert("Ocorreu um erro ao tentar excluir os itens selecionados.");
        }
    }
}