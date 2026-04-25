const API_URL = window.APP_CONFIG.API_URL;

export async function sendOutflow(orderData) {
  try {
    const response = await axios.post(`${API_URL}/api/outflows`, {
      date: orderData.date,
      clientName: orderData.clientName,
      productId: orderData.productId,
      totalPrice: orderData.totalPrice,
      quantity: orderData.quantity,
      placeId: orderData.placeId
    });
    
  } catch (error) {
    console.error(error);
  }
}

export async function getOutflows(placeId) {
    try {
      const response = await axios.get(`${API_URL}/api/outflows/place/${placeId}`)
      return response.data
    }
    catch (error){
      console.error(error);
    }
}

export async function deleteOutflow(id) {
    try {
      const response = await axios.delete(`${API_URL}/api/outflows/${id}`)
    }
    catch (error){
      console.error(error);
    }
}