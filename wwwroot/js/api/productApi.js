const API_URL = window.APP_CONFIG.API_URL;

export async function getProducts() {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

export async function updateProduct(id, field, value) {
    try {
        const resposta = await axios.post(`${API_URL}/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        return resposta.data;
    }
    catch (error) {
        console.error(error);
    }
}

export async function sendImage(id, formData) {
    try {
        const resposta = await axios.post(`${API_URL}/products/${id}`, formData);

    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);
    }
}