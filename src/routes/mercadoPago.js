const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");
router
    .post("/payment", PaymentController.payment)
    .get("/getpayment", PaymentController.getPayments)
    .get("/getonepayment", PaymentController.getOnePayment)

module.exports = router;