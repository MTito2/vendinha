import { registerUser } from "../api/authApi.js";

document.getElementById("btn-send").addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("Button clicked, attempting to register user...");

    const email = document.getElementById("input-email").value;
    const password = document.getElementById("input-password").value;

    try {
        const response = await registerUser({ email, password });
        window.location.href = "/pages/admin/users.html";

    } catch (error) {
        console.error("Error registering user:", error);
    }
});