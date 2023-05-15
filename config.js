const mongoose = require("mongoose");


const uri = "mongodb+srv://cheickdev1010:toto1010@cluster0.s9yvjom.mongodb.net/?retryWrites=true&w=majority";
const connection = async () => {
	await mongoose.connect(uri);
	console.log("connected");
};
connection();
