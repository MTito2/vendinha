export async function sendOutflow(orderData) {
  try {
    const response = await axios.post('http://localhost:5216/api/outflows', {
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