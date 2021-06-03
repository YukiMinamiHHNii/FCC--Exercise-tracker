const express = require("express"),
	dotenv = require("dotenv").load(),
	bodyParser = require("body-parser"),
	cors = require("cors"),
	{ Connection } = require("./src/utils/connection"),
	exerciseRouter = require("./src/routers/exerciseRouter");

const app = express();

Connection.handleConnection();

app.use(cors());

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/views"));
app.use("/api/exercise", exerciseRouter);

app.listen(process.env.SERVER_PORT);
console.log(`App running on port ${process.env.SERVER_PORT}`);
