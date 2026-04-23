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