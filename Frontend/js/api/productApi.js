const API_URL = window.APP_CONFIG.API_URL;

export async function getProducts() {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(id, field, value) {
    try {
        const response = await axios.patch(`${API_URL}/api/products/${id}`, {
            [field]: value
        });
    }
    catch (error) {
        console.error(error);
    }
}

export async function sendImage(id, formData) {
       try {
            const resposta = await axios.post(`${API_URL}/api/products/${id}`, formData);
            console.log("Imagem enviada com sucesso!", resposta.data);

        } catch (erro) {
            console.error("Erro na comunicação com a API:", erro);
        }
    }