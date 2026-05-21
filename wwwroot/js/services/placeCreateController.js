import { sendPlace } from "../api/placeApi.js";

const btnSend = document.getElementById("btn-send")

btnSend.addEventListener("click", async () => {
    const inputPlace = document.getElementById("input-place")
    const inputAcronym = document.getElementById("input-acronym")

    const placeValue = inputPlace.value
    const acronymValue = inputAcronym.value

    const entryValid = placeValue && acronymValue
    
    if (entryValid) {
        const placeData = {
            name: placeValue,
            acronym: acronymValue
        }

        await sendPlace(placeData)
        window.location.href = "/pages/admin/place_history.html"
    }

    else {
        checkEntry()
    }

})

function checkEntry () {
    const inputs = document.querySelectorAll(".input")
    inputs.forEach(input => {
        if (input.value === "") {
            input.classList.add("input-invalid")
            input.addEventListener("click", () => {
                input.classList.remove("input-invalid")
            })
        }
    });
}