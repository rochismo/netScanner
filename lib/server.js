const express = require("express");
const bodyParser = require("body-parser");
const pingRouter = require("./routes/pingRouter")


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
		this.app.use("/", pingRouter)
	}

	listen() {
		this.app.listen(3000, function () {
			console.log("http://localhost:3000");
		});
	}
}