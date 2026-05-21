const API_URL = window.APP_CONFIG.API_URL;

export async function getInflows(month = null, year = null) {
    try {
        let response;

        if (month && year) {
            response = await axios.get(`${API_URL}/inflows?month=${month}&year=${year}`)
        }

        else{
            response = await axios.get(`${API_URL}/inflows`)
        }

        return response.data
    }
    catch (error){
      console.error(error);
    }
}

export async function sendInflow(inflowData) {

    try {
        const response = await axios.post(`${API_URL}/inflows`, {
            date: inflowData.date,
            productId: 0,
            ProductName: inflowData.productName,
            price: inflowData.price,
            quantity: inflowData.quantity,
            placeId: inflowData.placeId
        });
    }
     catch (error) {
        console.log(error)
     }   
}
