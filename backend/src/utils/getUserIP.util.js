function getUserIP(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  console.dir(ip);

  return ip;
}

module.exports = getUserIP;
