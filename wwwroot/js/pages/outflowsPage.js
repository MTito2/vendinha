import { OutflowsView } from "../services/outflowsController.js";

const outflowsView = new OutflowsView();
await outflowsView.loadOutflows();


const dp = new AirDatepicker('#date-input', {
    locale: {
        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        daysMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
        months: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril',
            'Maio', 'Junho', 'Julho', 'Agosto',
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        monthsShort: [
            'Jan', 'Fev', 'Mar', 'Abr',
            'Mai', 'Jun', 'Jul', 'Ago',
            'Set', 'Out', 'Nov', 'Dez'
        ],
        today: 'Hoje',
        clear: 'Limpar',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm',
        firstDay: 0
    },

    view: 'months',
    minView: 'months',
    dateFormat: 'MMMM yyyy',
    onSelect({ date }) {
        const input = document.querySelector('#date-input')
        console.log(input)
        console.log(date)

        if (date) {
            input.dataset.month = date.getMonth() + 1
            input.dataset.year = date.getFullYear()
        }
        
        dp.hide()
    }
})
