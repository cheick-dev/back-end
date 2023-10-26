const express = require("express");
const EventEmitter = require("events");
const { Webhook } = require("fedapay");
const bodyParser = require("body-parser");

const app = express();
const port = 4242;

// Event //

// Remplacez 'wh_sandbox...' par votre véritable clé secrète d'endpoint
const endpointSecret = "wh_live_UUl7n5jl5uAPK8TIJKO99iGZ";

// Utilisez body-parser pour récupérer le corps brut en tant que tampon (buffer)
app.use(bodyParser.raw({ type: "application/json" }));

let myStatus = "null";

// Endpoint pour recevoir les webhooks
app.post("/webhook", (request, response) => {
	const sig = request.headers["x-fedapay-signature"];

	console.log(request.body);

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
	response.json({ received: true });
});

// app.get("/myStatus", (req, res) => {
// 	// console.log(req.body);
// 	myEmitter.emit("canceled");
// 	myEmitter.emit("approved");
// 	return res.json({ myStatus: "canceled" });
// });

app.listen(port, () => console.log(`Server is running on port ${port}`));
