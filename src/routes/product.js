const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();

router
    .get("/product", productController.listProducts)
    .get("/product/search", productController.listProductsByDep)
    .get("/product/:id", productController.listProductsById)


module.exports = router;