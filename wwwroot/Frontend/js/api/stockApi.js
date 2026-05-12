const API_URL = window.APP_CONFIG.API_URL;

export async function getStock() {
  try {
    const response = await axios.get(`${API_URL}/api/stock`);
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}

export async function getStockForPlace(placeId) {
  try {
    const response = await axios.get(`${API_URL}/api/stock/place/${placeId}`);
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}