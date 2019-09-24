module.exports = {
  ECHOMessageType: [
    "REPLY",
    "NA",
    "NA",
    "DESTINATION_UNREACHABLE",
    "SOURCE_QUENCH",
    "REDIRECT"
  ],
  DestinationUnreachableCode: [
    "NET",
    "HOST",
    "PROTOCOL",
    "PORT",
    "FRAGMENTATION",
    "ROUTE_FAILED",
    "NET_UNKNOWN",
    "HOST_UNKNOWN",
    "HOST_ISOLATED",
    "NET_PROHIBITED",
    "HOST_PROHIBITED",
    "NET_UNREACHABLE",
    "HOST_UNREACHABLE",
    "COMM_PROHIBITED",
    "HOST_PRECEDENCE",
    "PRECEDENCE_CUTOFF"
  ],
  RedirectCode: ["NETWORK", "HOST", "SERVICE_NETWORK", "HOST_NETWORK"],
  type: "OTHER",
  code: "NO_CODE"
};
