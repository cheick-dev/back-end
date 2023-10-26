const express = require("express");
const { Webhook } = require("fedapay");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Remplacez 'wh_sandbox...' par votre véritable clé secrète d'endpoint
const endpointSecret = "wh_live_UUl7n5jl5uAPK8TIJKO99iGZ";

// Utilisez body-parser pour récupérer le corps brut en tant que tampon (buffer)
app.use(bodyParser.raw({ type: "application/json" }));

let myStatus = "null";

// Endpoint pour recevoir les webhooks
app.post("/webhook", (request, response) => {
	const sig = request.headers["x-fedapay-signature"];

	// console.log(request.body);

	let event;

	try {
		event = Webhook.constructEvent(request.body, sig, endpointSecret);
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Gérez l'événement en fonction de son nom
	switch (event.name) {
		case "transaction.created":
			// Transaction créée
			myStatus = "created";
			console.log("Transaction créée", myStatus);
			break;
		case "transaction.approved":
			// Transaction approuvée
			myStatus = "approved";
			console.log("Transaction approuvée", myStatus);
			break;
		case "transaction.canceled":
			// Transaction annulée
			myStatus = "canceled";
			console.log("Transaction annulée", myStatus);
			break;
		default:
			console.log(`Unhandled event type ${event.name}`);
	}

	// Répondez pour confirmer la réception de l'événement
	response.json({ received: true, body: request.body });
});

const Users = [
	// {
	// 	nom: "toto",
	// 	email: "toto1010@gmail.com",
	// 	numero: "0123456789",
	// 	dates: [],
	// },
];

app.get("/users", (req, res) => {
	res.json(Users);
});
// app.get("/dates", (req, res) => {
// 	res.json({ Dates: Users.d });
// });

app.get("/posts/:nom/:email/:numero", async (req, res) => {
	const { nom, email, numero } = req.params;
	const dates = [];
	if ((nom, email, numero)) {
		const user = Users.filter((el) => el.email === email);

		if (user.length === 0) {
			Users.push({ nom, email, numero, dates });
			console.log(Users);
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

		if (user.length === 0) {
			return res.json({ message: "User is not found", status: "err" });
		} else {
			console.log(user[0].dates);
			user[0].dates = [...user[0].dates, dateEtHeureEnChaine];
			return res.json({
				message: "Eregistrement effectuer avec succes",
				status: "ok",
			});
		}
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
