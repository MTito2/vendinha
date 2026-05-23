import {ProductsAdmView} from "../services/productsAdmController.js";

new Tablesort(document.getElementById('table'))

const productsAdmView = new ProductsAdmView();
await productsAdmView.loadProducts();

