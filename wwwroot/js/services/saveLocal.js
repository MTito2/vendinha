import { setStorage } from '../services/storage.js';
import { getStorage } from '../services/storage.js';
import { getPlaces } from '../api/placeApi.js';

const params = new URLSearchParams(window.location.search);
let localInUrl = params.get("local")
localInUrl = localInUrl ? localInUrl.replace(/%20/g, " ").toLowerCase() : "";

const placeResponse = await getPlaces();
const localsInDataBase = [];

placeResponse.forEach(element => {
    localsInDataBase.push(element.name.toLowerCase())
});

console.log(localsInDataBase)

if (localsInDataBase.includes(localInUrl)) {
    setStorage("local", localInUrl);
}

else {
    window.location.href = "../error.html";
}
