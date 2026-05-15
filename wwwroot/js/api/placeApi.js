const API_URL = window.APP_CONFIG.API_URL;

export async function getPlaces() {
  try {
    const response = await axios.get(`${API_URL}/place`);
    return response.data;
    
  } catch (error) {
      console.error("Erro ao buscar places:", error);
      return []
  }
}

export async function sendPlace(placeData) {

    try {
        const response = await axios.post(`${API_URL}/place`, {
            name: placeData.name,
            acronym: placeData.acronym,
        });
    }
     catch (error) {
        console.log(error)
     }   
}
