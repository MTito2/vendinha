import { PaymentController } from "../services/paymentController.js";

const paymentController = new PaymentController();

paymentController.renderProducts();
paymentController.renderTotal();