const { Socket } = require("../utils/socket"),
	MongoClient = require("mongodb").MongoClient,
 	dotenv = require("dotenv");

class Connection {
	static handleConnection(server) {
		if (this.client) return this.client;
			MongoClient.connect(process.env.MONGO_DB_CONNECTION, this.options)
			.then((connection) => {
				this.client = connection;
			})
			.then(() => {
				this.initObservers(this.client);
			})
			.catch((error) => {
				console.log(`Error while creating connection ${error}`);
			});
	}

}

Connection.client = null;
Connection.options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
Connection.initObservers = (client) => {
		return client.db()
			.collection("exercises")
			.watch()
			.on("change", (next) => {
				switch (next.operationType) {
					case "insert":
					case "replace":
						console.log(next.fullDocument);
						Socket.io.of("/api/socket").emit("log", next.fullDocument);
					break;
					case "update":
						console.log(next.updateDescription.updatedFields);
						Socket.io.of("/api/socket").emit("log", next.updateDescription.updatedFields);
					break;
					case "delete":
						console.log(next.documentkey);
					Socket.io.of("/api/socket").emit("log", next.documentkey);
					break;
			}
		});
	};


module.exports = { Connection };

// const MongoClient = require("mongodb").MongoClient,
// 	dotenv = require("dotenv"),
// 	exerciseDAO = require("../daos/exerciseDAO");

// class Connection {
// 	static handleConnection() {
// 		if (this.client) return this.client;
// 		MongoClient.connect(process.env.MONGO_DB_CONNECTION, this.options)
// 			.then((connection) => {
// 				this.client = connection;
// 			})
// 			.then(() => {
// 				exerciseDAO.initObservers(this.client);
// 			})
// 			.catch((error) => {
// 				console.log(`Error while creating connection ${error}`);
// 			});
// 	}
// }

// Connection.client = null;
// Connection.options = {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// };

// module.exports = { Connection };