function getUserIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  );
}


module.exports = getUserIP;