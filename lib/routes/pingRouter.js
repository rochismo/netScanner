const router = require("express").Router();
const {Pinger, getDetails} = require("@rochismo/net-utils")
const pinger = new Pinger();
const SSE = require("express-sse")
const sse = new SSE();
pinger.sse = sse;

router.get("/", async (req, res) => {
    const data = await getDetails();
    res.render("index", data)
})

router.get("/pingSweep", async function (req, res) {
    req.setTimeout(0)
    const ip = req.query.ip;
    const aliveHosts = await pinger.pingSweep(ip);
    res.json(aliveHosts);
})

router.get("/pingProgress", sse.init);


module.exports = router