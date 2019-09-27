const express = require("express");
const bodyParser = require("body-parser");
const {Pinger, getDetails} = require("@rochismo/net-utils")
const pinger = new Pinger();
const SSE = require("express-sse")
const sse = new SSE();
pinger.sse = sse;


module.exports = class Server {
	constructor() {
		this.app = express();
	}

	init() {
		this.app.set("views", __dirname + "/views");
		this.app.set("view engine", "ejs")

		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());


	}

	addRoutes() {
		this.app.get("/", async (req, res) => {
			const data = await getDetails();
			res.render("index", data)
		});

		this.app.get("/pingSweep", async function (req, res) {
			req.setTimeout(0)
			const ip = req.query.ip;
			const aliveHosts = await pinger.pingSweep(ip);
			res.json(aliveHosts);
		});

		this.app.get("/pingProgress", sse.init)
	}

	listen() {
		this.app.listen(3000, function () {
			console.log("http://localhost:3000");
		});
	}
}