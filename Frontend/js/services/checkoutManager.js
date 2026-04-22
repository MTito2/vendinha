import { sendOutflow } from "../api/outflowApi.js";

export class OrderService {
    #date = "";
    #products = [];
    #totalPrice = 0;
    #name = "";
    #lastName = "";
    #fullName = "";
    #placeid = 0;

    constructor() {
        this.#date = new Date().toISOString();
        this.#products = JSON.parse(localStorage.getItem("products")) || [];
        this.#fullName = this.formatName();

        const local = JSON.parse(localStorage.getItem("local")) || "";
        this.#placeid = local == "dr" ? 1 : local === "cg" ? 2 : 0;
    }

    formatName() {
        this.#name = JSON.parse(localStorage.getItem("name")) || "";
        this.#lastName = JSON.parse(localStorage.getItem("lastName")) || "";
        
        this.#name = this.#name.charAt(0).toUpperCase() + this.#name.slice(1);
        this.#lastName = this.#lastName.charAt(0).toUpperCase() + this.#lastName.slice(1);

        return `${this.#name} ${this.#lastName}`;
    }

    async sendOrder() {
        for (const product of this.#products) {
            const orderData = {
                date: this.#date,
                clientName: this.#fullName,
                productId: parseInt(product.id),
                totalPrice: parseFloat(product.price) * parseInt(product.quantity),
                quantity: parseInt(product.quantity),
                placeId: this.#placeid
            };

            await sendOutflow(orderData);
        }
    }
}