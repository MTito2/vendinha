import { getProducts } from "../api/productApi.js";
import { updateProduct } from "../api/productApi.js";
import { deleteProduct } from "../api/productApi.js";
import { sendImage } from "../api/productApi.js";
import { formatPrice } from "../utils/formatPrice.js";

const API_URL = window.APP_CONFIG.API_URL;

export class ProductsAdmView {
    constructor() {
        this.products = [];
        this.imgSelected = null;
        this.productCurrentId = null;
    }

    async loadProducts() {
        this.products = await getProducts();
        this.renderTable();
    }

    renderTable() {
        const existingTbody = document.querySelector("#table tbody");
        if (existingTbody) {
            existingTbody.remove();
        }

        const table = document.getElementById("table");
        const tableBody = document.createElement("tbody");

        for (const product of this.products) {
            const tableRow = document.createElement("tr");
            tableRow.setAttribute("id", product.id);
            const tableDataImg = document.createElement("td");
            const tableDataProduct = document.createElement("td");
            const tableDataPrice = document.createElement("td");
            const tableDataBtnTrash = document.createElement("td");

            tableDataBtnTrash.classList.add("table-cell", "align-middle", "text-center");

            tableDataProduct.classList.add("table-cell", "align-middle");
            tableDataProduct.setAttribute("contenteditable", "true");
            tableDataProduct.setAttribute("data-field", "name");

            tableDataPrice.classList.add("table-cell", "align-middle");
            tableDataPrice.setAttribute("contenteditable", "true");
            tableDataPrice.setAttribute("data-sort", product.price);
            tableDataPrice.setAttribute("data-field", "price");

            tableDataImg.innerHTML = `<img src="${API_URL}${product.img}" alt="${product.name}" class="img-fluid img-product" data-bs-toggle="modal" data-bs-target="#modalImg">`;
            tableDataProduct.textContent = product.name;
            tableDataPrice.textContent = formatPrice(product.price);
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

            tableRow.appendChild(tableDataImg);
            tableRow.appendChild(tableDataProduct);
            tableRow.appendChild(tableDataPrice);
            tableRow.appendChild(tableDataBtnTrash);
            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
        this.btnTrashListener();
        this.updateProductListener()
        this.imgListener();
        this.btnConfirmListener();
    }

    updateProductListener() {
        const editableCells = document.querySelectorAll("[contenteditable]"); 
        editableCells.forEach(cell => {
            const actualText = cell.textContent.trim();

            cell.addEventListener("blur", async () => {
                const row = cell.closest("tr");
                const id = parseInt(row.getAttribute("id"));
                const field = cell.getAttribute("data-field");
                let value = cell.textContent.trim();

                // Validação para o campo de preço
                if (field === "price") {
                    value = value.replace(/[^0-9,.-]+/g,"").replace(",", ".");
                    
                    if (value === "" || isNaN(value)) {
                        cell.textContent = actualText;
                        return;
                    }

                    cell.textContent = formatPrice(parseFloat(value));
                }

                if (actualText != value) {
                    try {
                        if (field === "price") {
                            await updateProduct(id, field, value);

                        } else {
                            await updateProduct(id, field, value);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        });
    }

    btnTrashListener() {
        const btnTrash = document.querySelectorAll(".btn-trash");
        btnTrash.forEach(btn => {
            btn.addEventListener("click", () => {
                const row = btn.closest("tr");
                const id = parseInt(row.getAttribute("id"));

                deleteProduct(id);
                row.remove();
            });
        });
        }
    
    imgListener() {
        const imgElements = document.querySelectorAll(".img-product");
        imgElements.forEach(img => {
            img.addEventListener("click", () => {
                this.productCurrentId = parseInt(img.closest("tr").getAttribute("id"));
                const modalBody = document.getElementById("modal-body");   
                modalBody.classList.add("position-relative"); 
                modalBody.innerHTML = "";
                
                const modalImg = document.createElement("img");

                const inputLabel = document.createElement("label");
                inputLabel.setAttribute("for", "inputImagem");
                inputLabel.classList.add("edit-icon", "position-absolute", "top-0", "start-0", "m-2");
                inputLabel.innerHTML = `
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    class="lucide lucide-pencil-icon lucide-pencil"
                >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    <path d="m15 5 4 4"/>
                </svg>
                `;
        
                const inputFile = document.createElement("input");
                inputFile.setAttribute("type", "file");
                inputFile.setAttribute("id", "inputImagem");
                inputFile.setAttribute("accept", "image/*");
                inputFile.hidden = true;

                modalBody.appendChild(inputLabel);
                modalBody.appendChild(inputFile);

                modalImg.classList.add("img-fluid", "rounded", "img-product-modal");
                modalImg.setAttribute("src", img.src);
                modalImg.setAttribute("alt", img.alt);      
        
                modalBody.appendChild(modalImg);

                const row = img.closest("tr");
                const id = parseInt(row.getAttribute("id"));

                this.fileInputListener();
            });
        })

    }

    fileInputListener() {
        const inputFile = document.getElementById("inputImagem");
        inputFile.addEventListener("change", async () => {
            const file = inputFile.files[0];
            if (file) {
                const modalImg = document.querySelector(".img-product-modal");
                this.imgSelected =  file;
                modalImg.src = URL.createObjectURL(file);
            }
        });
    }

    btnConfirmListener() {
        const btnConfirm = document.getElementById("btn-confirm");
        const formData = new FormData();

        btnConfirm.addEventListener("click", async () => {
            formData.append("file", this.imgSelected);
            
            if (this.imgSelected) {
                try {
                    await sendImage(this.productCurrentId, formData);
                    this.renderTable();
                    this.loadProducts();
                } catch (error) {
                    console.error(error);
                    alert("Erro ao enviar a imagem.");
                }
            }
        });
    }
}