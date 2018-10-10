const mongoose = require("mongoose"),
			Schema = mongoose.Schema;

const exerciseSchema = new Schema({
	username: { type: String, required: true },
	log: [
		{
			description: { type: String, required: true },
			duration: { type: Number, min: 1, required: true },
			date: { type: Date, default: Date.now }
		}
	]
});

module.exports = mongoose.model("Exercise", exerciseSchema);
