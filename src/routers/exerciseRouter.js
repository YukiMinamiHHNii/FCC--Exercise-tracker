const express = require("Express"),
			router = express.Router(),
			exerciseController= require('../controllers/exerciseController');

router.get("/", exerciseController.all);
router.get("/user", exerciseController.user);

module.exports = router;
