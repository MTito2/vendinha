const API_URL = window.APP_CONFIG.API_URL;

export async function getInvoices() {
    try {
        const response = await axios.get(`${API_URL}/invoices`);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

export async function uploadInvoice(id, formData) {
    try {
        const response = await axios.post(`${API_URL}/invoices/${id}/pdf`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

export async function sendInvoiceData(data) {
    try {
        const response = await axios.post(`${API_URL}/invoices`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function editInvoiceData(id, requestData, file) {
    try {
        const formData = new FormData();
        
        // Mapeia os campos idênticos às propriedades da classe InvoiceRequest do C#
        formData.append("date", requestData.date);
        formData.append("desc", requestData.desc);
        formData.append("type", requestData.type);
        formData.append("value", requestData.value);

        // Se o usuário selecionou um arquivo novo para substituir o PDF anterior
        if (file) {
            formData.append("invoiceFile", file); 
        }

        const response = await axios.put(`${API_URL}/invoices/${id}`, formData, {
            headers: {
                // Informa ao ASP.NET Core que os dados estão vindo de um formulário híbrido
                'Content-Type': 'multipart/form-data' 
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Erro na API editInvoiceData:", error);
        throw error;
    }
}

export async function deleteInvoice(id) {
    try {
        const response = await axios.delete(`${API_URL}/invoices/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}