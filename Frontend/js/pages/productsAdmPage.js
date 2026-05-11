import {ProductsAdmView} from "../services/productsAdmController.js";

const productsAdmView = new ProductsAdmView();
await productsAdmView.loadProducts();

new DataTable('#table', {
    language: {
        url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
    },  columnDefs: [
        {
            orderable: false,
            targets: [0, 3]
        }
    ],

});