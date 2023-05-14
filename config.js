const mongoose = require("mongoose");


const uri2 = "mongodb+srv://cheick:toto1010@cluster0.kgqopto.mongodb.net/";
const connection = async () => {
	await mongoose.connect(uri2);
	console.log("connected");
};
connection();
