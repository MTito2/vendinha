export async function getProducts() {
  try {
    const response = await axios.get('http://localhost:5216/api/products');
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct(id) {
    try {
      const response = await axios.delete(`http://localhost:5216/api/products/${id}`)
    }
    catch (error){
      console.error(error);
    }
}

export async function updateProduct(id, field, value) {
    try {
        const response = await axios.patch(`http://localhost:5216/api/products/${id}`, {
            [field]: value
        });
    }
    catch (error) {
        console.error(error);
    }
}

export async function sendImage(formData) {
       try {
            const resposta = await axios.post("URL_DA_SUA_API/produtos", formData);

            // O Axios já converte a resposta da API automaticamente (fica disponível em resposta.data)
            console.log("Imagem enviada com sucesso!", resposta.data);

        } catch (erro) {
            // O Axios cai no catch automaticamente se a API retornar um erro (400, 404, 500...)
            console.error("Erro na comunicação com a API:", erro);
        }
    }