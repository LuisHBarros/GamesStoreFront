const express = require("express");
const productController = require("../controllers/product");
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.use(authMiddleware);

router
//link exexple: localhost:3001/product/buy/630e6530e8243b35420f742a/?siize=stockL

    .get('/test-token', userController.testToken)
    .post("/product", productController.registerProduct)
    .put("/product/:id", productController.refreshProduct)
    .delete("/product/:id", productController.deleteProduct)
    .get("/user/logout", userController.logoutUser)

module.exports = router;