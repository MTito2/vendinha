import {StockView} from "../services/stockController.js";

const stockView = new StockView();
await stockView.loadStock();

