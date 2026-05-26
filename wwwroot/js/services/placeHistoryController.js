import { getPlaces } from "../api/placeApi.js";
import { updatePlace } from "../api/placeApi.js";
import { deletePlace } from "../api/placeApi.js";

export class PlacesView {
    constructor() {
        this.places = [];
    }

    async loadPlaces() {
        this.places = await getPlaces();
        this.places.sort((a, b) => a.name.localeCompare(b.name));
        this.renderTable();
    }

    renderTable() {
        const tableBody = document.createElement("tbody");
        tableBody.setAttribute("id", "table-body");
        const table = document.getElementById("table");

        for (const place of this.places) {
            const tableRow = document.createElement("tr");
            const tableDataPlace = document.createElement("td");
            const tableDataAcronym = document.createElement("td");
            const tableDataBtnTrash = document.createElement("td");

            tableRow.setAttribute("id", place.id);
            tableDataPlace.classList.add("table-cell", "align-middle", "text-center");
            tableDataAcronym.classList.add("table-cell", "align-middle", "text-center");

            tableDataPlace.setAttribute("contenteditable", "true")
            tableDataPlace.setAttribute("data-field", "name")
            tableDataAcronym.setAttribute("contenteditable", "true")
            tableDataAcronym.setAttribute("data-field", "acronym")

            tableDataPlace.textContent = place.name;
            tableDataAcronym.textContent = place.acronym;
            tableDataBtnTrash.innerHTML = `
            <button class="btn-trash">
                <svg 
                class="icon-trash" 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#464d5c" 
                stroke-width="2"
                stroke-linecap="round" 
                stroke-linejoin="round"
                >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
            `;

            tableRow.appendChild(tableDataPlace);
            tableRow.appendChild(tableDataAcronym);
            tableRow.appendChild(tableDataBtnTrash);

            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
        this.btnTrashListener();
        this.updatePlaceListener();
    }

    btnTrashListener() {
        const btnTrash = document.querySelectorAll(".btn-trash");
        btnTrash.forEach(btn => {
            btn.addEventListener("click", () => {
                const row = btn.closest("tr");
                const id = parseInt(row.getAttribute("id"));

                deletePlace(id);
                row.remove();
            });
        });
    }

    updatePlaceListener() {
        const editableCells = document.querySelectorAll("[contenteditable]");
        editableCells.forEach(cell => {
            const actualText = cell.textContent.trim();

            cell.addEventListener("blur", async () => {
                const row = cell.closest("tr");
                const id = parseInt(row.getAttribute("id"));
                const field = cell.getAttribute("data-field");
                let value = cell.textContent.trim();

                if (actualText != value) {
                    try {
                        if (field === "price") {
                            await updatePlace(id, field, value);

                        } else {
                            await updatePlace(id, field, value);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        });
    }
}