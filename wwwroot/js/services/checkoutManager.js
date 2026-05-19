import { sendOutflow } from "../api/outflowApi.js";
import { getPlaces } from "../api/placeApi.js";

export async function sendOrder () {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const acronym = JSON.parse(localStorage.getItem("local")) || "";
    const placesInDb = await getPlaces();

    const placeId = placesInDb.find(place => place.acronym.toLowerCase() === acronym).id
    const currentDate = new Date().toISOString();
    const clientName = formatName()
    
    for (const product of products){
        const orderData = {
            date: currentDate,
            clientName: clientName,
            productId: parseInt(product.id),
            quantity: parseInt(product.quantity),
            placeId: placeId
        }

        await sendOutflow(orderData);
    }

}

function formatName() {
    let name = JSON.parse(localStorage.getItem("name")) || "";
    let lastName = JSON.parse(localStorage.getItem("lastName")) || "";
    
    name = name.charAt(0).toUpperCase() + name.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    return `${name} ${lastName}`;
}
