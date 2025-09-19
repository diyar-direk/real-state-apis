require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connection = require("./db");
connection();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan(":method :url :status :response-time ms"));

const routers = {
  users: "users/usersRouter",
  contractors: "users/contactorsRouter",
  city: "address/cityRouter",
  region: "address/regionRouter",
  "property-type": "property/propertyTypeRouter",
  "property-status": "property/propertyStatusRouter",
  properties: "property/propertyRouter",
};

Object.entries(routers).forEach(([path, router]) => {
  const route = require(`./router/${router}`);
  app.use(`/api/${path}`, route);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
