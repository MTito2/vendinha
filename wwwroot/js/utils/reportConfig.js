import { getOutflows } from "../api/outflowApi.js";
import { InflowsHistoryView } from "../services/inflowHistoryController.js";

export async function generateReport(data, dataType, title) {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (dataType === "outflows") {
        data = data.map(item => ({
            Data: formatDate(item.date),
            Cliente: item.clientName,
            Produto: item.product.name,
            "Valor (un)": item.product.price.toFixed(2).replace(".", ","),
            "Valor Total": (item.product.price * item.quantity).toFixed(2).replace(".", ","),
            Quantidade: item.quantity,
            Local: item.place.name,
        }))
    }

    // Configurações de imagem e criação do workbook
    const workbook = new ExcelJS.Workbook();
    const response = await fetch("/assets/imgs/logo-vale-white.png");

    const buffer = await response.arrayBuffer();

    const imageId = workbook.addImage({
        buffer,
        extension: "png"
    });

    const worksheet = workbook.addWorksheet(title);
    const columns = Object.keys(data[0]);

    // Configurações de estilo para o cabeçalho e células
    worksheet.columns = columns.map(column => ({
        header: column,
        key: column,
        width: 20
    }));

    // Adiciona uma linha vazia no início para a imagem do logo
    worksheet.spliceRows(1, 0, []);
    worksheet.getRow(1).height = 60;

    worksheet.addImage(imageId, {
        tl: {
            col: 0,
            row: 0
        },
        ext: {
            width: 150,
            height: 67
        }
    });

    // Mescla a primeira linha para o título do relatório
    const lastColumn = String.fromCharCode(64 + columns.length);
    worksheet.mergeCells(`A1:${lastColumn}1`);
    const titleCell = worksheet.getCell("A1");

    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "007D78" }
    };

    // Configurações de cor para o cabeçalho
    worksheet.getRow(2).eachCell(cell => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC000" }
        };

        cell.font = {
            color: { argb: "00000000" },
            bold: true
        };
    });

    // Adiciona os dados ao worksheet
    for (const row of data) {
        worksheet.addRow(row);
    }

    // Configurações de alinhamento e borda para todas as células
    worksheet.eachRow(row => {
        row.eachCell(cell => {
            cell.alignment = {
                horizontal: "center",
                vertical: "middle"
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });
    });

    const bufferWorkbook = await workbook.xlsx.writeBuffer();

    const blob = new Blob(
        [bufferWorkbook],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${title}.xlsx`;

    link.click();
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    const hora = String(date.getHours()).padStart(2, "0");
    const minuto = String(date.getMinutes()).padStart(2, "0");
    const segundo = String(date.getSeconds()).padStart(2, "0");

    return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;
}




