const express = require("express"),
			dotenv = require("dotenv").load(),
			bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/views"));

app.listen(process.env.SERVER_PORT);
console.log(`App running on port ${process.env.SERVER_PORT}`);
