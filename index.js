const express = require("express");
const app = express();
const port = 3000;
require("./config");
const { Utilisateur } = require("./user");
const { Register } = require("./register");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.get("/", async (req, res)=> {
	res.json({message: "hello"})
})
app.get("/posts/:nom/:email/:numero", async (req, res) => {
	const { nom, email, numero } = req.params;

	if ((nom, email, numero)) {
		const bool = await Utilisateur.findOne({ email: email });

		if (!bool) {
			try {
				const utilisateur = new Utilisateur({ nom, email, numero });
				await utilisateur.save();
				return res.json({ utilisateur, status: "ok" });
			} catch (error) {
				return res.json({ message: error.message, status: "erreur" });
			}
		}
		return res.json({ message: "L'utilisateur existe déja", status: "existe", bool });
	}
});

app.get("/scanner/:userEmail", async (req, res) => {
	const { userEmail } = req.params;
	if (userEmail) {
		const date = new Date();
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		const dateEtHeureEnChaine = date.toLocaleString("fr-FR", options);
		try {
			const prev =await Register.findOne({ email: userEmail })
			const bool = await Register.findOneAndUpdate(
				{ email: userEmail },
				{ dates: [...prev.dates, dateEtHeureEnChaine] }
			);
			// console.log(bool);
			if (!bool) {
				try {
					const register = new Register({ email: userEmail, dates:  dateEtHeureEnChaine});
					await register.save();
					return res.json({ register });
				} catch (error) {
					return res.json({ message: error.message, status: "erreur" });
				}
			}
			
			return res.json({ bool, status : "ok" });
		} catch (error) {
			return res.json({ message: error.message, status: "erreur" });
		}
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
