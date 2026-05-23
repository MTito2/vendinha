const API_URL = window.APP_CONFIG.API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;