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
    }

    else {
        checkEntry()
    }

})

function checkEntry () {
    const inputPlace = document.getElementById("input-place")
    const inputAcronym = document.getElementById("input-acronym")
    const placeValue = inputPlace.value
    const acronymValue = inputAcronym.value

    if (placeValue === false) {
        inputPlace.classList.add("input-invalid")
    }

    else {
        
    }
}