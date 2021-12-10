require("dotenv").config();
const Express = require("express");
const app = Express();
const cors = require("cors");
const dbConnection = require("./db");
const controllers = require("./controllers");
const middleware = require("./middleware");

app.use(Express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(middleware.headers);

app.use("/user", controllers.userController);
app.use("/sportscard", controllers.sportscardController);
app.use("/comments", controllers.commentsController);

dbConnection
  .authenticate()
  .then(() => dbConnection.sync({}))
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(process.env.DATABASE_URL);
      console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server is down! Error = ${err}`);
  });
