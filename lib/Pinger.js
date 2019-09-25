const ping = require("net-ping");
const ip_cidr = require("ip-cidr");

function allProgress(proms, progress_cb) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(()=> {    
      d ++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}

module.exports = class Pinger {
  constructor(address, sse) {
    this.hosts = []
    this.sse = sse;
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
    allProgress.bind(this)

  }

  async fulfillPromisesAndFilterHosts() {
    const alive =  await allProgress(this.aliveHosts,
      (p) => {
         this.sse.send(p.toFixed(2))
    })
    this.aliveHosts = alive.filter(host => host !== false)
  }

  setRange(ip) {
    console.log("setting range")
    this.aliveHosts = []
    this.hosts = new ip_cidr(ip).toArray();
  }
};
