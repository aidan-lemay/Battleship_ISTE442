const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

  if (!token) {
    res.writeHead(302, { "Location": '/signIn' });
    return res.end();
  }
  try {
    const decoded = jwt.verify(token, config.JWT_KEY);
    req.user = decoded;
  } catch (err) {
    console.log("Caught Error: " + err);
    res.writeHead(302, { "Location": '/signIn' });
    return res.end();
  }
  return next();
};

module.exports = verifyToken;