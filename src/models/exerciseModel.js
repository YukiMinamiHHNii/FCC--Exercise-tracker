const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const exerciseSchema = new Schema({
	description: { type: String, required: true},
	duration: { type: Number, min: 1, required: true},
	date: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Exercise", exerciseSchema);
