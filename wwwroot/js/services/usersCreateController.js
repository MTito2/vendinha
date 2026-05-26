import { registerUser } from "../api/authApi.js";

document.getElementById("btn-send").addEventListener("click", async (event) => {
    event.preventDefault();
    const inputEmail = document.getElementById("input-email")
    const inputPassword = document.getElementById("input-password")

    const emailValue = inputEmail.value
    const passwordValue = inputPassword.value

    const entryValid = emailValue && passwordValue

    if (entryValid) {

        const email = inputEmail.value;
        const password = inputPassword.value;
        const response = await registerUser({ email, password });
        window.location.href = "/pages/admin/users.html";
    } 
    else {
        checkEntry()
    }

})

function checkEntry () {
    const inputs = document.querySelectorAll(".input")
    inputs.forEach(input => {
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);

        if (input.value === "" || !validEmail) {
            input.classList.add("input-invalid")
            input.addEventListener("click", () => {
                input.classList.remove("input-invalid")
            })
        }
    });
}