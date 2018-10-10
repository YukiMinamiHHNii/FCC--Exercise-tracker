const mongoose = require("mongoose"),
	dotenv = require("dotenv").load(),
	exerciseModel = require("../models/exerciseModel");

function handleConnection(connected) {
	mongoose.connect(
		process.env.MONGO_DB_CONNECTION,
		error => {
			error ? connected(false, error) : connected(true, null);
		}
	);
}

exports.createExercise = result => {
	handleConnection((connected, error) => {
		if (!connected) {
			return result(error);
		}
		let test = new exerciseModel({
			username: "test",
			log: [{ description: "testDesc", duration: 1 }]
		});
		test.save((err, data) => {
			return err ? result(err) : result(null, data);
		});
	});
};
