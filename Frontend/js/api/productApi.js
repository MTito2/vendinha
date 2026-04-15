export async function getProducts() {
  try {
    const response = await axios.get('http://localhost:5216/api/products');
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}