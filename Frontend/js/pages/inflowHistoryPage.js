import { InflowsHistoryView } from "../services/inflowHistoryController.js";

const inflowHistoryView = new InflowsHistoryView();
await inflowHistoryView.loadInflowView();

const table = document.getElementById('table');
new Tablesort(table);
