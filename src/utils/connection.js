const MongoClient = require("mongodb").MongoClient,
	dotenv = require("dotenv"),
	exerciseDAO = require("../daos/exerciseDAO");

class Connection {
	static handleConnection() {
		if (this.client) return this.client;
		MongoClient.connect(process.env.MONGO_DB_CONNECTION, this.options)
			.then((connection) => {
				console.log("Connected to db");
				this.client = connection;
			})
			.then(() => {
				exerciseDAO.initObservers(this.client);
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

module.exports = { Connection };
