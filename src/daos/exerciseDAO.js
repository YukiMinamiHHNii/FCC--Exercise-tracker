const mongoose = require("mongoose"),
	User = require("../models/userModel"),
	Exercise = require("../models/exerciseModel");

exports.createUser = username => {
	return checkUsername({ username: username })
		.then(() => {
			return saveUser(username);
		})
		.then(savedUser => {
			return savedUser;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function checkUsername(data) {
	return User.findOne(data)
		.exec()
		.then(foundUser => {
			if (foundUser) {
				return Promise.reject({ status: "Username already taken" });
			} else {
				return;
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status ? err.status : "Error while retrieving user info",
				error: err.message
			});
		});
}

function saveUser(username) {
	return User({
		_id: getRand(),
		username: username
	})
		.save()
		.then(savedUser => {
			return { _id: savedUser._id, username: savedUser.username };
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while saving user",
				error: err.message
			});
		});
}

exports.readAllUsers = () => {
	return findAllUsers()
		.then(data => {
			return data;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function findAllUsers() {
	return User.find()
		.select({ _id: 1, username: 1 })
		.exec()
		.then(foundUsers => {
			return foundUsers;
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while retrieving user list",
				error: err.message
			});
		});
}

exports.createExercise = (exerciseData, result) => {
	let user;
	return checkUserByID(exerciseData.user)
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
			user = userData;
			return saveExercise(data);
		})
		.then(savedExercise => {
			return updateUser(user, savedExercise);
		})
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function checkUserByID(data) {
	return User.findById(data)
		.exec()
		.then(foundUser => {
			if (foundUser) {
				return foundUser;
			} else {
				return Promise.reject({ status: "User data not found" });
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status ? err.status : "Error while retrieving user info",
				error: err.message
			});
		});
}

function saveExercise(exerciseData) {
	return Exercise(exerciseData)
		.save()
		.then(result => {
			return result;
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while saving new exercise entry",
				error: err.message
			});
		});
}

function updateUser(userData, exerciseData) {
	userData.log.push(exerciseData._id);
	return userData
		.save()
		.then(updatedUser => {
			return {
				_id: updatedUser._id,
				username: updatedUser.username,
				description: exerciseData.description,
				duration: exerciseData.duration,
				date: exerciseData.date
			};
		})
		.catch(err => {
			return Promise.reject({
				status: "Error while updating user log",
				error: err.message
			});
		});
}

exports.readUserLog = queryObj => {
	let queryLimit = queryObj.limit ? queryObj.limit : 0;
	let dates = [
		queryObj.from ? { date: { $gte: queryObj.from } } : {},
		queryObj.to ? { date: { $lte: queryObj.to } } : {}
	];
	return getExerciseLog(queryObj.userId, queryLimit, dates)
		.then(exerciseLog => {
			return exerciseLog;
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function getExerciseLog(userId, limit, dates) {
	return User.findOne({ _id: userId })
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
				return foundLog;
			} else {
				return Promise.resolve({ status: `Log for ${userId} is empty` });
			}
		})
		.catch(err => {
			return Promise.reject({
				status: err.status
					? err.status
					: "Error while retrieving log... are your parameters correct?",
				error: err.message
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
