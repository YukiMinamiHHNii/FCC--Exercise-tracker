const exerciseDAO = require("../daos/exerciseDAO");

exports.newUser = (req, res) => {
	exerciseDAO.readUserByProperty({ username: req.body.user }, (err, data) => {
		if (err || data) {
			return res.json({ error: "Username already taken" });
		} else {
			exerciseDAO.createUser(req.body.user, (err, data) => {
				return err
					? res.json({ error: "Error while saving new user data" })
					: res.json(data);
			});
		}
	});
};

exports.getUsers = (req, res) => {
	exerciseDAO.readAllUsers((err, data) => {
		return err
			? res.json({ error: "Error while reading users from DB" })
			: res.json(data);
	});
};

exports.newExercise = (req, res) => {
	exerciseDAO.createExercise(req.body, (err, data) => {
		return err ? res.json({ error: err }) : res.json(data);
	});
};

exports.getLog = (req, res) => {
	exerciseDAO.readUserLog(req.query, (err, data) => {
		return err ? res.json({ error: err }) : res.json(data);
	});
};
