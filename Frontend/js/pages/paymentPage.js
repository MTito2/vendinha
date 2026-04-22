import { PaymentController } from "../services/paymentController.js";
import { OrderService } from "../services/checkoutManager.js";

const btnCheckout = document.getElementById("btn-checkout");

const paymentController = new PaymentController();
const orderService = new OrderService();

paymentController.renderProducts();
paymentController.renderTotal();

btnCheckout.addEventListener("click", async () => {
    await orderService.sendOrder();
    window.location.href = "../pages/grateful.html";
});