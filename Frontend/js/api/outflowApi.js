export async function sendOutflow(orderData) {
  try {
    const response = await axios.post('http://localhost:5216/api/outflows', {
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

export async function getOutflows() {
    try {
      const response = await axios.get("http://localhost:5216/api/outflows")
      return response.data
    }
    catch (error){
      console.error(error);
    }
}

export async function deleteOutflow(id) {
    try {
      const response = await axios.delete(`http://localhost:5216/api/outflows/${id}`)
    }
    catch (error){
      console.error(error);
    }
}