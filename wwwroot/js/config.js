const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
console.log("Is localhost:", isLocalhost);

window.APP_CONFIG = {
    API_URL: isLocalhost ? "http://localhost:8080/api" : "/api"
};