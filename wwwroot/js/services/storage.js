export function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setStorage(key, value) {
    try{ localStorage.setItem(key, JSON.stringify(value));
    }
    catch(err) {
        console.error("Erro ao salvar no storage:", err);
    }
}