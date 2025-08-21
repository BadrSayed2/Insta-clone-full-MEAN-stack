const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const logger = require("./utils/logger");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");
const followRouter = require("./routes/follow.router");
const { globalError, handleNotFound } = require("./middlewares/global-error");

const fs = require("fs");
const yaml = require("js-yaml");
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const DB = require("./config/db_config");

DB.connect_to_mongodb();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/follow", followRouter);

app.use(handleNotFound);

app.use(globalError);
if (process.env.NODE_ENV === "development") {
  logger.debug("Development Mode");
} else {
  logger.info("Production Mode");
}
app.listen(4000, () => {
  logger.info("Server started on port 4000");
});
