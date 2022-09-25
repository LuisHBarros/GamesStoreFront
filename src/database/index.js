const mongoose = require('mongoose')
require('dotenv').config

const user = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT
const name = process.env.MONGO_NAME

//ClouthesStore
// mongoose.connect("mongodb://localhost/nodeapi");

  mongoose.connect('mongodb+srv://adm:adm@cluster0.papoeqy.mongodb.net/ClouthesStore');

let db = mongoose.connection;

module.exports = db;
