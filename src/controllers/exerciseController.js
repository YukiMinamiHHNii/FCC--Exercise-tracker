const exerciseDAO = require("../daos/exerciseDAO");

exports.newUser = (req, res) => {
	exerciseDAO.createUser(req.body.user, result => {
		return res.json(result);
	});
};

exports.getUsers = (req, res) => {
	exerciseDAO.readAllUsers(result => {
		return res.json(result);
	});
};

exports.newExercise = (req, res) => {
	exerciseDAO.createExercise(req.body, result => {
		return res.json(result);
	});
};

exports.getLog = (req, res) => {
	exerciseDAO.readUserLog(req.query, result => {
		return res.json(result);
	});
};
