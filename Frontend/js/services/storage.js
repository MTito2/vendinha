export function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setStorage(key, value) {
    console.log("Tentando salvar no storage...")
    try{ localStorage.setItem(key, JSON.stringify(value));
        console.log("Salvo com sucesso!")
    }
    catch(err) {
        console.error("Erro ao salvar no storage:", err);
    }
}