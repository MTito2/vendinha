import { OutflowsView } from "../services/outflowsController.js";
import { deleteOutflow } from "../api/outflowApi.js";
const outflowsView = new OutflowsView();
await outflowsView.loadOutflows();

const table = document.getElementById('table');
new Tablesort(table);

const btnTrash = document.querySelectorAll(".btn-trash");
btnTrash.forEach(btn => {
    btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        const id = parseInt(row.getAttribute("id"));

        deleteOutflow(id);
        row.remove();
    });
});