import { setStorage } from '../services/storage.js';
import { getStorage } from '../services/storage.js';

const params = new URLSearchParams(window.location.search);
const localInUrl = params.get("local").replace(/"/g, '');

if (localInUrl === "dr" || localInUrl === "cg") {
    setStorage("local", localInUrl);
}

else {
    window.location.href = "../error.html";
}
