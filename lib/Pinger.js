const ping = require("net-ping");
const ip_cidr = require("ip-cidr");

module.exports = class Pinger {
  constructor(address) {
    this.hosts = []
    if (address) {
      this.hosts = new ip_cidr(address).toArray();
    }
    this.aliveHosts = [];
    this.session = ping.createSession();
  }

  pingSweep() {
    this.hosts.forEach((host, idx) => {
      this.aliveHosts.push(
        new Promise((res, rej) => {
          this.session.pingHost(host, function(error, target) {
            if (error == undefined) {
              res(host);
            } else {
              res(false);
            }
          });
        })
      );
    });
  }

  async fulfillPromisesAndFilterHosts() {
    const alive =  await Promise.all(this.aliveHosts);
    this.aliveHosts = alive.filter(host => host !== false)
  }

  setRange(ip) {
    this.hosts = new ip_cidr(ip).toArray();
  }
};
