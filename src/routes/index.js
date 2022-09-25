const express = require('express');
const product = require("./product");
const user = require("./user");
const auth = require("./auth");
const mercadoPago = require("./mercadoPago")

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({ message : "Clothes Store" })
    })

    app.use(
        express.json(),
        user,
        mercadoPago,

        product,
        auth,
    )
}

module.exports = routes;