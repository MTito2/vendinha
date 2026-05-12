export class PaymentController {
    #products = [];

    constructor() {
        this.#products = JSON.parse(localStorage.getItem("products")) || [];
    }

    priceTotal() {
        let total =  this.#products.reduce((total, product) => {
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

}