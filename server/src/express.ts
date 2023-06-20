import config from "./config/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compress());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.get("/", (req, res) => {
  res.send(config.env);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
