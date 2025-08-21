const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const routerUser = require("./routes/user.router");

const fs = require("fs");
const yaml = require("js-yaml");
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
const DB = require("./config/db_config");

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DB.connect_to_mongodb();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/user", routerUser);

module.exports = app;
