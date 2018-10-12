const express = require("express"),
			router = express.Router(),
			exerciseController= require('../controllers/exerciseController');

router.post("/new-user", exerciseController.newUser);
router.get("/users", exerciseController.getUsers);
router.post("/add", exerciseController.newExercise);
router.get("/log", exerciseController.getLog);

module.exports = router;
