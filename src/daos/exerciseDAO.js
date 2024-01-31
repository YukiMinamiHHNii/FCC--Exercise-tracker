const { Connection } = require("../utils/connection");

exports.createUser = (username) => {
	return checkUsername({ username })
		.then(() => {
			return saveUser(username);
		})
		.then((savedUser) => {
			return savedUser;
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

function checkUsername(data) {
	return Connection.client
		.db()
		.collection("exercises")
		.findOne(data)
		.then((foundUser) => {
			if (foundUser) {
				return Promise.reject({ status: "Username already taken" });
			} else {
				return;
			}
		})
		.catch((err) => {
			return Promise.reject({
				status: err.status ? err.status : "Error while retrieving user info",
				error: err.message,
			});
		});
}

function saveUser(username) {
	return Connection.client
		.db()
		.collection("exercises")
		.insertOne({
			username,
		})
		.then((savedUser) => {
			let result = savedUser.ops[0];
			return { _id: result._id, username: result.username };
		})
		.catch((err) => {
			return Promise.reject({
				status: "Error while saving user",
				error: err.message,
			});
		});
}

exports.readAllUsers = () => {
	return findAllUsers()
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

function findAllUsers() {
	return Connection.client
		.db()
		.collection("exercises")
		.find({}, { projection: { username: 1 } })
		.toArray()
		.then((foundUsers) => {
			return foundUsers;
		})
		.catch((err) => {
			return Promise.reject({
				status: "Error while retrieving user list",
				error: err.message,
			});
		});
}

exports.createExercise = (exerciseData, result) => {
	let user;
	return checkUserByUsername(exerciseData.username)
		.then((userData) => {
			let data = exerciseData.date
				? {
						description: exerciseData.desc,
						duration: exerciseData.duration,
						date: exerciseData.date,
				  }
				: {
						description: exerciseData.desc,
						duration: exerciseData.duration,
						date: new Date(),
				  };
			user = userData;
			return updateUser(user, data);
		})
		.then((result) => {
			return result;
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

function checkUserByUsername(username) {
	return Connection.client
		.db()
		.collection("exercises")
		.findOne({ username })
		.then((foundUser) => {
			if (foundUser) {
				return foundUser;
			} else {
				return Promise.reject({ status: "User data not found" });
			}
		})
		.catch((err) => {
			return Promise.reject({
				status: err.status ? err.status : "Error while retrieving user info",
				error: err.message,
			});
		});
}

function updateUser(userData, exerciseData) {
	return Connection.client
		.db()
		.collection("exercises")
		.findOneAndUpdate({ _id: userData._id }, { $push: { log: exerciseData } })
		.then((updatedUser) => {
			return checkUserByUsername(updatedUser.value.username);
		})
		.then((foundUser) => {
			return foundUser;
		})
		.catch((err) => {
			return Promise.reject({
				status: "Error while updating user log",
				error: err.message,
			});
		});
}

exports.readUserLog = (queryObj) => {
	let dates = [
		queryObj.from ? { $gte: ["$$log.date", new Date(queryObj.from)] } : {},
		queryObj.to ? { $lte: ["$$log.date", new Date(queryObj.to)] } : {},
	];
	return getExerciseLog(queryObj.username, dates)
		.then((exerciseLog) => {
			return exerciseLog;
		})
		.catch((err) => {
			return Promise.reject(err);
		});
};

function getExerciseLog(username, dates) {
	return Connection.client
		.db()
		.collection("exercises")
		.aggregate([
			{
				$match: {
					username,
				},
			},
			{
				$project: {
					username: 1,
					log: {
						$filter: {
							input: "$log",
							as: "log",
							cond: {
								$and: dates,
							},
						},
					},
				},
			},
		])
		.toArray()
		.then((foundLog) => {
			if (foundLog) {
				return foundLog;
			} else {
				return Promise.resolve({ status: `Log for ${username} is empty` });
			}
		})
		.catch((err) => {
			return Promise.reject({
				status: err.status
					? err.status
					: "Error while retrieving log... are your parameters correct?",
				error: err.message,
			});
		});
}