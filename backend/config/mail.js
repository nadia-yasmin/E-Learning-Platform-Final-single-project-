const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: "d4b49be584d049",
        pass: "3456c03bbc9613",
    },
});
console.log("host, port ,EMAIL_USER,EMAIL_PASSWORD",process.env.EMAIL_HOST, process.env.EMAIL_PORT ,process.env.EMAIL_USER,process.env.EMAIL_PASSWORD)
module.exports = transporter;