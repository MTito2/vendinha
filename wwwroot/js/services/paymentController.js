import { sendOrder } from "../services/checkoutManager.js";

export class PaymentController {
    #products = [];

    constructor() {
        this.#products = JSON.parse(localStorage.getItem("products")) || [];
    }

    priceTotal() {
        let total = this.#products.reduce((total, product) => {
            return total + (parseFloat(product.price) * parseInt(product.quantity));
        }, 0);

        return total.toFixed(2).replace('.', ',');
    }

    renderProducts() {
        const container = document.getElementById('container-products');

        this.#products.forEach(product => {
            const productElement = document.createElement('div');
            const productNameElement = document.createElement('p');
            const productPriceElement = document.createElement('p');
            productElement.className = "d-flex justify-content-between"

            productElement.appendChild(productNameElement);
            productElement.appendChild(productPriceElement);

            productNameElement.textContent = `${product.name} x${product.quantity}`;
            productPriceElement.textContent = `R$ ${(parseInt(product.quantity) * parseFloat(product.price)).toFixed(2).replace('.', ',')}`;

            container.appendChild(productElement);
        });
    }

    renderTotal() {
        const totalElement = document.getElementById('title-total-price');
        totalElement.textContent = `R$ ${this.priceTotal()}`;
    }



    getCodPix(price) {
        const CHAVE = "vendinhasolidariamariana@gmail.com";
        const NOME = "LUCIA LUSTOSA JARDIM";
        const CIDADE = "MARIANA";

        const tag = (id, val) => id + val.length.toString().padStart(2, '0') + val;

        let p = "000201";
        p += tag("26", "0014br.gov.bcb.pix" + tag("01", CHAVE));
        p += "52040000";
        p += "5303986";

        p += tag("54", price);

        p += "5802BR";
        p += tag("59", NOME);
        p += tag("60", CIDADE);
        p += tag("62", "0503***");
        p += "6304";

        return p + this.crc16(p);
    }

    crc16(str) {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
            crc ^= (str.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
                else crc = crc << 1;
            }
            crc &= 0xFFFF;
        }
        return crc.toString(16).toUpperCase().padStart(4, '0');
    }

    pasteCodPix() {
        const codPix = this.getCodPix(this.priceTotal().replace(',', '.').toString());
        navigator.clipboard.writeText(codPix).then(() => {
        }).catch(err => {
            console.error('Erro ao copiar o código Pix:', err);
        });
    }

    checkoutListener() {
        const btnCheckout = document.getElementById("btn-checkout");

        btnCheckout.addEventListener("click", async () => {

            try {
                await sendOrder();
                this.pasteCodPix();
                const alertSucess = this.createAlertElement("sucess");
                btnCheckout.appendChild(alertSucess);
                alertSucess.style.display = "block";

                setTimeout(() => {
                    window.location.href = "../pages/grateful.html";
                }, 3000);

            } catch (error) {
                console.error("Erro ao enviar o pedido:", error);
                const alertError = this.createAlertElement("error");
                btnCheckout.appendChild(alertError);
                alertError.style.display = "block";
                setTimeout(() => {
                    alertError.style.display = "none";
                }, 3000);
            }
        });
    }

    createAlertElement(type) {
        const alertDiv = document.createElement("div");

        if (type === "sucess") {
            alertDiv.className = "alert alert-success position-fixed w-75 text-center";
            alertDiv.id = "alert-div-sucess";
            alertDiv.style.display = "none";
            alertDiv.textContent = "Código Pix copiado com sucesso.";
        }

        else if (type === "error") {
            alertDiv.className = "alert alert-danger position-fixed translate-middle-x text-center";
            alertDiv.id = "alert-div-error";
            alertDiv.style.display = "none";
            alertDiv.textContent = "Houve um erro.";
        }

        return alertDiv
    }
}