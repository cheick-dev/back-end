const mongoose = require("mongoose");

const register = new mongoose.Schema({
	email: {
		type: String,
	},
	dates: {
		type: Array,
	},
});
const Register = mongoose.model("Register", register);

module.exports = { Register };
