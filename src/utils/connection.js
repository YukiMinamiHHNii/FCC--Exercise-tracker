const MongoClient = require("mongodb").MongoClient,
	dotenv = require("dotenv");

class Connection {
	static handleConnection() {
		if (this.client) return this.client;
		MongoClient.connect(process.env.MONGO_DB_CONNECTION, this.options)
			.then((connection) => {
				console.log("Connected to db");
				this.client = connection;
			})
			.then(() => {
				this.client
					.db()
					.collection("exercises")
					.watch()
					.on("change", (next) => {
						switch (next.operationType) {
							case "insert":
							case "replace":
								console.log(next.fullDocument);
								break;
							case "update":
								console.log(next.updateDescription.updatedFields);
								break;
							case "delete":
								console.log(next.documentkey);
						}
					});
			});
	}
}

Connection.client = null;
Connection.options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

module.exports = { Connection };
