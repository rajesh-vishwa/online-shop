import mongoose from "mongoose";
import config from "./config/config";
import app from "./express";

process.on("unhandledRejection", (ex) => {
  throw ex;
});

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => console.log(`mongoDb connected to:  ${config.mongoUri}`))
  .catch((error) => console.log("Could not connect to mongodb "));

mongoose.connection.on("error", () => {
  console.log(`unable to connect to database: ${config.mongoUri}`);
});

app.listen(config.port, () => console.log(`Server running on ${config.port}`));
