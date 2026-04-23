import {ProductsAdmView} from "../services/productsAdmController.js";

const productsAdmView = new ProductsAdmView();
await productsAdmView.loadProducts();

const table = document.getElementById('table');
new Tablesort(table);
