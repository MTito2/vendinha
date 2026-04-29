import {StockView} from "../services/stockController.js";

const stockView = new StockView();
await stockView.loadStock();

const table = document.getElementById('table');
new Tablesort(table);
