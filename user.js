const mongoose = require("mongoose");
const utilisateurSchema = new mongoose.Schema({
	nom: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	numero: {
		type: String,
		required: true,
	},

});

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

module.exports = { Utilisateur };
