const { spawn } = require('child_process');
const os = require("os")

if (os.platform() == "linux") {
    spawn("sudo", ["npm", "run", "init"])
}  