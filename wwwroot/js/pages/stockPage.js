import {StockView} from "../services/stockController.js";

new Tablesort(document.getElementById('table'))

const stockView = new StockView();
await stockView.loadStock();

