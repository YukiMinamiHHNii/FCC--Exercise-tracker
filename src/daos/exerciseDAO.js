const mongoose = require("mongoose"),
	dotenv = require("dotenv").load(),
	User = require("../models/userModel"),
	Exercise = require("../models/exerciseModel");

function handleConnection() {
	return new Promise((resolve, reject) => {
		mongoose
			.connect(process.env.MONGO_DB_CONNECTION)
			.then(() => {
				resolve();
			})
			.catch(err => {
				reject({ status: "Error while connecting to DB", error: err.message });
			});
	});
}

exports.createUser = (username, result) => {
	handleConnection()
		.then(() => {
			return checkUsername({ username: username });
		})
		.then(() => {
			return saveUser(username);
		})
		.then(data => {
			return result(data);
		})
		.catch(err => {
			return result(err);
		});
};

function checkUsername(data) {
	return new Promise((resolve, reject) => {
		User.findOne(data)
			.exec()
			.then(foundUser => {
				if (foundUser) {
					reject({ status: "Username already taken" });
				} else {
					resolve();
				}
			})
			.catch(err => {
				reject({
					status: "Error while retrieving user info",
					error: err.message
				});
			});
	});
}

function saveUser(username) {
	return new Promise((resolve, reject) => {
		new User({
			_id: getRand(),
			username: username
		})
			.save()
			.then(savedUser => {
				resolve({ _id: savedUser._id, username: savedUser.username });
			})
			.catch(err => {
				reject({
					status: "Error while saving user",
					error: err.message
				});
			});
	});
}

exports.readAllUsers = result => {
	handleConnection()
		.then(() => {
			return findAllUsers();
		})
		.then(data => {
			return result(data);
		})
		.catch(err => {
			return result(err);
		});
};

function findAllUsers() {
	return new Promise((resolve, reject) => {
		User.find()
			.select({ _id: 1, username: 1 })
			.exec()
			.then(foundUsers => {
				resolve(foundUsers);
			})
			.catch(err => {
				reject({
					status: "Error while retrieving user list",
					error: err.message
				});
			});
	});
}

exports.createExercise = (exerciseData, result) => {
	handleConnection()
		.then(() => {
			return checkUserByID(exerciseData.user);
		})
		.then(userData => {
			let data = exerciseData.date
				? {
						description: exerciseData.desc,
						duration: exerciseData.duration,
						date: exerciseData.date
				  }
				: {
						description: exerciseData.desc,
						duration: exerciseData.duration
				  };
			return saveExercise(userData, data);
		})
		.then(savedExercise => {
			return result(savedExercise);
		})
		.catch(err => {
			return result(err);
		});
};

function checkUserByID(data) {
	return new Promise((resolve, reject) => {
		User.findById(data)
			.exec()
			.then(foundUser => {
				if (foundUser) {
					resolve(foundUser);
				} else {
					reject({ status: "User data not found" });
				}
			})
			.catch(err => {
				reject({
					status: "Error while retrieving user info",
					error: err.message
				});
			});
	});
}

function saveExercise(userData, exerciseData) {
	return new Promise((resolve, reject) => {
		Exercise(exerciseData)
			.save()
			.then(savedExercise => {
				return savedExercise;
			})
			.then(exercise => {
				userData.log.push(exercise._id);
				userData
					.save()
					.then(updatedUser => {
						resolve({
							_id: updatedUser._id,
							username: updatedUser.username,
							description: exercise.description,
							duration: exercise.duration,
							date: exercise.date
						});
					})
					.catch(err => {
						reject({
							status: "Error while updating user log",
							error: err.message
						});
					});
			})
			.catch(err => {
				reject({
					status: "Error while saving new exercise entry",
					error: err.message
				});
			});
	});
}

exports.readUserLog = (queryObj, result) => {
	handleConnection()
		.then(() => {
			let queryLimit = queryObj.limit ? queryObj.limit : 0;
			let dates = [
				queryObj.from ? { date: { $gte: queryObj.from } } : {},
				queryObj.to ? { date: { $lte: queryObj.to } } : {}
			];
			return getExerciseLog(queryObj.userId, queryLimit, dates);
		})
		.then(exerciseLog => {
			return result(exerciseLog);
		})
		.catch(err => {
			return result(err);
		});
};

function getExerciseLog(userId, limit, dates) {
	return new Promise((resolve, reject) => {
		User.findOne({ _id: userId })
			.populate({
				path: "log",
				match: { $and: dates },
				select: { description: 1, duration: 1, date: 1, _id: 0 },
				options: { limit: limit }
			})
			.select({ _id: 1, username: 1, log: 1 })
			.exec()
			.then(foundLog => {
				if (foundLog) {
					resolve(foundLog);
				} else {
					resolve({ status: `Log for ${userId} is empty` });
				}
			})
			.catch(err => {
				reject({
					status: "Error while retrieving log, are your parameters correct?",
					error: err.message
				});
			});
	});
}

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
