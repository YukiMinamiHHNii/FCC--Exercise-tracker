const express = require("express"),
	dotenv = require("dotenv").load(),
	bodyParser = require("body-parser"),
	cors = require("cors"),
	{ Connection } = require("./src/utils/connection"),
	{ Socket } = require("./src/utils/socket"),
	exerciseRouter = require("./src/routers/exerciseRouter");

const app = express();
const server = require("http").createServer(app);

Connection.handleConnection();
Socket.handleConnection(server);

app.use(cors());

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/views"));
app.use("/api/exercise", exerciseRouter);

Socket.io.of("/api/socket").on("connection", (socket) => {
	console.log("socket.io: User connected: ", socket.id);

	socket.on("disconnect", () => {
		console.log("socket.io: User disconnected: ", socket.id);
	});
});

server.listen(process.env.SERVER_PORT);
console.log(`App running on port ${process.env.SERVER_PORT}`);