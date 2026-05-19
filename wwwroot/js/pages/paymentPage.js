import { PaymentController } from "../services/paymentController.js";
import { sendOrder } from "../services/checkoutManager.js";

const btnCheckout = document.getElementById("btn-checkout");

const paymentController = new PaymentController();

paymentController.renderProducts();
paymentController.renderTotal();

btnCheckout.addEventListener("click", async () => {
    await sendOrder();
    window.location.href = "../pages/grateful.html";
});