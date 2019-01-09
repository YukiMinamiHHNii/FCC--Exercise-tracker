const exerciseDAO = require("../daos/exerciseDAO");

exports.newUser = (req, res) => {
	exerciseDAO
		.createUser(req.body.username)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.getUsers = (req, res) => {
	exerciseDAO
		.readAllUsers()
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.newExercise = (req, res) => {
	exerciseDAO
		.createExercise(req.body)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};

exports.getLog = (req, res) => {
	exerciseDAO
		.readUserLog(req.query)
		.then(result => {
			return res.json(result);
		})
		.catch(err => {
			return res.json(err);
		});
};
