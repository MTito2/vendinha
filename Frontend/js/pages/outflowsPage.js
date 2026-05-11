import { OutflowsView } from "../services/outflowsController.js";
const outflowsView = new OutflowsView();
await outflowsView.loadOutflows();

new DataTable('#table', {
    language: {
        url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
    }, columnDefs: [
        {
            orderable: false,
            targets: [6]
        }
    ]

});
