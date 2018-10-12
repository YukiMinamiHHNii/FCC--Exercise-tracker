const mongoose = require("mongoose"),
			Exercise= require('./exerciseModel'),
			Schema = mongoose.Schema;

const userSchema = new Schema({
	_id: { type: String, required: true },
	username: { type: String, required: true },
	log: [{ type: Schema.Types.ObjectId, ref: "Exercise" }]
});

module.exports = mongoose.model("User", userSchema);
