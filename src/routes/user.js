const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router
    
    .post("/user/register", userController.registerUser)
    .post("/user/login", userController.authenticateUser)
    //.get("/user/:id")
    .post("/user/forgot-password", userController.forgotPassword)
    .post("/user/recover-password", userController.recoverPassword)
module.exports = router;