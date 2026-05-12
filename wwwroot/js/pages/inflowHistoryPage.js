import { InflowsHistoryView } from "../services/inflowHistoryController.js";

const inflowHistoryView = new InflowsHistoryView();
await inflowHistoryView.loadInflowView();

new DataTable('#table', {
    language: {
        url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
    }
});