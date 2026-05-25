import api from "./api.js";

export async function getInflows(month = null, year = null) {
    try {
        let response;

        if (month && year) {
            response = await api.get(`/inflows?month=${month}&year=${year}`)
        }

        else{
            response = await api.get(`/inflows`)
        }

        return response.data
    }
    catch (error){
      console.error(error);
    }
}

export async function sendInflow(inflowData) {

    const response = await api.post(`/inflows`, {
        date: inflowData.date,
        productId: 0,
        ProductName: inflowData.productName,
        price: inflowData.price,
        quantity: inflowData.quantity,
        placeId: inflowData.placeId
    });
}
