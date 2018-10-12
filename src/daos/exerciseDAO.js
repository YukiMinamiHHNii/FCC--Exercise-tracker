const mongoose = require("mongoose"),
	dotenv = require("dotenv").load(),
	User = require("../models/userModel"),
	Exercise = require("../models/exerciseModel");

function handleConnection(connected) {
	mongoose.connect(
		process.env.MONGO_DB_CONNECTION,
		error => {
			return error ? connected(false, error) : connected(true);
		}
	);
}

exports.createUser = (username, result) => {
	handleConnection((connected, error) => {
		if (!connected) {
			return result(error);
		}
		let saveUser = new User({
			_id: getRand(),
			username: username
		});
		saveUser.save((err, data) => {
			return err
				? result(err)
				: result(null, { _id: data._id, username: data.username });
		});
	});
};

exports.createExercise = (exerciseData, result) => {
	handleConnection((connected, error) => {
		if (!connected) {
			return result(error);
		}

		User.findById(exerciseData.user, (err, user) => {
			if (err || !user) {
				return result("user data not found");
			}

			let saveExercise = exerciseData.date
				? new Exercise({
						description: exerciseData.desc,
						duration: exerciseData.duration,
						date: exerciseData.date
				  })
				: new Exercise({
						description: exerciseData.desc,
						duration: exerciseData.duration
				  });

			saveExercise.save((err, exercise) => {
				if (err) {
					return result("Error while saving exercise to DB");
				} else {
					user.log.push(exercise._id);
					user.save((err, data) => {
						return err
							? result("Error while updating user data")
							: result(null, {
									_id: data._id,
									username: data.username,
									description: exercise.description,
									duration: exercise.duration,
									date: exercise.date
							  });
					});
				}
			});
		});
	});
};

exports.readAllUsers = result => {
	handleConnection((connected, error) => {
		if (!connected) {
			return result(error);
		}
		User.find()
			.select({ _id: 1, username: 1 })
			.exec((err, data) => {
				return err ? result(err) : result(null, data);
			});
	});
};

exports.readUserLog = (queryObj, result) => {
	handleConnection((connected, error) => {
		if (!connected) {
			return result(error);
		}
		let queryLimit = queryObj.limit ? queryObj.limit : 0;
		let dates = [
			queryObj.from ? { date: { $gte: queryObj.from } } : {},
			queryObj.to ? { date: { $lte: queryObj.to } } : {}
		];
		User.findOne({ _id: queryObj.userId })
			.populate({
				path: "log",
				match: { $and: dates },
				select: { description: 1, duration: 1, date: 1, _id: 0 },
				options: { limit: queryLimit }
			})
			.select({ _id: 1, username: 1, log: 1 })
			.exec((err, data) => {
				return err
					? result("Error while retrieving log, are your parameters correct?")
					: result(null, data);
			});
	});
};

exports.readUserByProperty = (queryObj, result) => {
	if (Object.keys(queryObj).length === 0) {
		return result("A non-empty object is needed for searching");
	} else {
		handleConnection((connected, error) => {
			if (!connected) {
				return result(error);
			}
			User.findOne(queryObj, (err, data) => {
				return err ? result(err) : result(null, data);
			});
		});
	}
};

function getRand() {
	let characters =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		size = 10,
		result = "";

	for (let x = 0; x <= size; x++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}

	return result;
}
