import {InflowCreateView} from "../services/inflowCreateController.js";

const inflowCreateView = new InflowCreateView();
await inflowCreateView.loadInflowView();

const table = document.getElementById('table');
new Tablesort(table);
