const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config

//Try to connect to database
const db = require("./database");
db.on("error", console.log.bind(console, "Connection Error"))
db.once("open", () => {
    console.log("Successfully connected to database");
})

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended : false }));
routes(app);


module.exports = app;