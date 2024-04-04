const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  // const token = req.header('token');
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("unauthorized user");

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(402).send("Invalid Token");
  }
};