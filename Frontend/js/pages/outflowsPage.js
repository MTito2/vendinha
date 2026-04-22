import { OutflowsView } from "../services/outflowsController.js";
const outflowsView = new OutflowsView();
await outflowsView.loadOutflows();

const table = document.getElementById('table');
new Tablesort(table);
