const jwt = require("jsonwebtoken");
const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!req.currentUser) {

      const headers =
        req.headers["authorization"] || req.headers["Authorization"];

      const token = headers?.split(" ")[1];

      if (!token) return res.status(401).json({ message: "UnAuthorized" });

      try {
        const checkToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!checkToken)
          return res.status(401).json({ message: "UnAuthorized" });

        req.currentUser = checkToken;
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired", error });
        }
        return res.status(401).json({ message: "UnAuthorized" });
      }
    }

    const isAuthorized = roles.includes(req.currentUser.role);
    if (!isAuthorized) return res.status(403).json({ message: "Forbidden" });
    next();
  };

module.exports = allowedTo;
