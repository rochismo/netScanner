const Pinger = require("./Pinger");
const express = require("express");
const bodyParser = require("body-parser");
const pinger = new Pinger();
const net = require("network");
const os = require("os");


const SSE = require("express-sse")
const sse = new SSE();
pinger.sse = sse;

function determineCidr(ip) {
	const ifaces = os.networkInterfaces();
	let cidrValue = "192.168.1.0/24"
	for (const iface in ifaces) {
		const ifaceObj = ifaces[iface];
		ifaceObj.forEach(({ address, cidr }) => {
			if (address == ip) {
				cidrValue = cidr;
			}
		})
	}
	return cidrValue
}

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
		this.app.get("/", (req, res) => {
			net.get_active_interface(function (err, { ip_address }) {
				let cidr = determineCidr(ip_address);
				res.render("index", { ip_cidr: cidr })
			});
		});

		this.app.get("/pingSweep", async function (req, res) {
			req.setTimeout(0)
			const ip = req.query.ip;
			pinger.setRange(ip);
			pinger.pingSweep();
			await pinger.fulfillPromisesAndFilterHosts();
			res.json(pinger.aliveHosts);
		});

		this.app.get("/pingProgress", sse.init)
	}

	listen() {

		this.app.listen(3000, function () {
			console.log("http://localhost:3000");
		});
	}
}