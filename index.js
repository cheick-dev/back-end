const express = require("express");
const app = express();
const port = 3000;


const Users = [];
const Dates = [];

app.get("/", (req, res)=> {
	res.json({message: "hello"})
})

app.get("/users", (req, res)=> {
	res.json({Users})
})
app.get("/dates", (req, res)=> {
	res.json({Dates})
})

app.get("/posts/:nom/:email/:numero", async (req, res) => {
	const { nom, email, numero } = req.params;

	if ((nom, email, numero)) {
		const user = Users.filter((el) => el.email === email);

		if (user.length === 0) {
			Users.push({ nom, email, numero });
			return res.json({ Users, status: "ok" });
		}
		return res.json({
			message: "L'utilisateur existe déja",
			status: "existe",
			user,
		});
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
		const user = Users.filter((el) => el.email === userEmail);
		const prev = Dates.filter((el) => el.userEmail === userEmail);
		console.log(prev[0].dates);
		if (user.length === 0) {
			Dates.push({
				userEmail: userEmail,
				dates: [...prev[0].dates, dateEtHeureEnChaine],
			});
			console.log("1", Dates);
			return res.json({ message: "Eregistrement effectuer avec succes", status: "ok" })
		} else {
			const date = Dates.filter((el) => el.userEmail === userEmail);
			date[0].dates = [...prev[0].dates, dateEtHeureEnChaine]
			console.log("2", Dates);
			return res.json({ message: "Eregistrement effectuer avec succes", status: "ok" })
		}

	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
