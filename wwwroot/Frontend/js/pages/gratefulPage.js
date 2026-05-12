setTimeout(() => {
    const local = JSON.parse(localStorage.getItem("local")) || "";
    window.location.href = `../index.html?local=${local}`;

    localStorage.removeItem("name");
    localStorage.removeItem("lastName");
    localStorage.removeItem("products");

}, 4000);