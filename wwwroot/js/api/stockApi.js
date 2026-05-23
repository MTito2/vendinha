import api from "./api.js";

export async function getStock() {
  try {
    const response = await api.get(`/stock`);
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}

export async function getStockForPlace(placeId) {
  try {
    const response = await api.get(`/stock/place/${placeId}`);
    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}