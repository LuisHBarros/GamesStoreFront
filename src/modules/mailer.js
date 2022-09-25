const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { host, port, secure, user, pass } = require("../config/mail.json")

var transport = nodemailer.createTransport({
    host,
    port,
    auth: { user,pass },
    secure
  });

  transport.use('compile', hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/resources/')
    },
    viewPath: path.resolve('./src/resources/'),
    extName: '.html',
  }));

module.exports =  transport;