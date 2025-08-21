const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");
const followRouter = require("./routes/follow.router");

const fs = require("fs");
const yaml = require("js-yaml");
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const DB = require("./config/db_config");

DB.connect_to_mongodb();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/follow", followRouter);

app.get("/", (req, res) => {
  res.send("welcome to insta app");
});

app.listen(4000, () => {
  console.log("welcome to mongo db server");
});
