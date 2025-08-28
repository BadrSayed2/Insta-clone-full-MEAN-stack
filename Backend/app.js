const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const logger = require("./utils/logger");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const followRouter = require("./routes/follow.routes");
const cors = require("cors")


const { globalError, handleNotFound } = require("./middlewares/global-error");
const morganMiddleware = require("./middlewares/morganLogger");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const yaml = require("js-yaml");
const openapiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));
const cors = require("cors");
const app = express();
app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true,
                
}));
app.use(express.json());
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
module.exports = app;
