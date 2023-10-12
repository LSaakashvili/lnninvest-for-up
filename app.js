const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./router/index");
const bodyParser = require("body-parser");
const DBConnection = require("./database/connection");
const {TextDecoder, TextEncoder} = require("util");

dotenv.config();
DB = DBConnection();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log("Server is listening on " + process.env.PORT);
})