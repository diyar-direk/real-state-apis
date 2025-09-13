const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const headers = req.headers["authorization"] || req.headers["Authorization"];
  const token = headers?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const checkToken = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = checkToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", error });
    }
    res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = isAuthenticated;
