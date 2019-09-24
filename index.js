const Pinger = require("./lib/Pinger");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pinger = new Pinger();
const net = require("network");
const os = require("os");
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function determineCidr(ip) {
  const ifaces = os.networkInterfaces();
  let cidrValue = "192.168.1.0/24"
  for (const iface in ifaces) {
    const ifaceObj = ifaces[iface];
    ifaceObj.forEach(({address, cidr}) => {
      if (address == ip) {
        cidrValue = cidr;
      }
    })
  }
  return cidrValue
}

determineCidr();

app.get("/", (req, res) => {
  net.get_active_interface(function(err, {ip_address}) {
    cidr = determineCidr(ip_address);
    res.render("index", {ip_cidr: cidr})
  });
});

app.get("/pingSweep", async function(req, res) {
  const ip = req.query.ip;
  pinger.setRange(ip);
  pinger.pingSweep();
  await pinger.fulfillPromisesAndFilterHosts();
  res.json(pinger.aliveHosts);
});

app.listen(3000, function() {
  console.log("http://localhost:3000");
});
