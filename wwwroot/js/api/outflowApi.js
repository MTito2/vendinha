const API_URL = window.APP_CONFIG.API_URL;

export async function sendOutflow(orderData) {
  try {
    const response = await axios.post(`${API_URL}/outflows`, {
      date: orderData.date,
      clientName: orderData.clientName,
      productId: orderData.productId,
      quantity: orderData.quantity,
      placeId: orderData.placeId
    });
    
  } catch (error) {
    console.error(error);
  }
}

export async function getOutflows(month = null, year = null) {
    try {

      let response;

      if (month && year) {
        response = await axios.get(`${API_URL}/outflows?month=${month}&year=${year}`)
      }

      else{
        response = await axios.get(`${API_URL}/outflows`)
      }

      return response.data
    }
    catch (error){
      console.error(error);
    }
}

export async function deleteOutflow(id) {
    try {
      const response = await axios.delete(`${API_URL}/outflows/${id}`)
    }
    catch (error){
      console.error(error);
    }
}
