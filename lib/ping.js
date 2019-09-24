const raw = require("raw-socket");
const {
  ECHOMessageType,
  DestinationUnreachableCode,
  RedirectCode
} = require("./codes");
let { type, code } = require("./codes");

function checksum(data) {
  const buffer = Buffer.from(data);
  let sum = 0;
  for (var i = 0; i < buffer.length; i = i + 2) {
    sum += buffer.readUIntLE(i, 2);
  }
  sum = (sum >> 16) + (sum & 0xffff);
  sum += sum >> 16;
  sum = ~sum;
  //return unsigned
  return new Uint16Array([sum])[0];
}

function parse(typeParam, codeParam) {
  if (typeParam < ECHOMessageType.length) {
    type = ECHOMessageType[typeParam];
  }
  switch (typeParam) {
    case 3:
      code = DestinationUnreachableCode[codeParam];
      break; //DESTINATION_UNREACHABLE
    case 5:
      code = RedirectCode[codeParam];
      break; //REDIRECT
  }
  return {
    result: type == 0,
    type: type,
    code: code
  };
}

function ping(ip) {
  return new Promise((res, rej) => {
    const socket = raw.createSocket({
      protocol: raw.Protocol.ICMP
    });
    const data = Buffer.alloc(12);
    data.writeUInt8(0x08, 0);
    data.writeUInt16LE(process.pid, 4);
    data.writeUInt16LE(checksum(data), 2);

    socket.on("error", function(data) {
        if (data) rej(data)
    })

    socket.send(data, 0, 12, ip, function(err, bytes) {
      if (err) rej(err);
    });

    socket.on(
      "message",
      function(buffer, source) {
        //[type]x1, [code]x1, [chksum]x2, [id]x2, [seq]x2, [data]x4
        // offset = 20
        const offset = 20;
        const type = buffer.readUInt8(offset);
        const code = buffer.readUInt8(offset + 1);
        socket.close();

        const status = parse(type, code); 
        if (status.type !== "REPLY") {
            rej("Host is not alive")
        }
        res({
          status,
          source
        });
      }
    );
  });
}

module.exports = ping;
