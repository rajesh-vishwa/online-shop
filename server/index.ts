import express from "express";
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
  res.send("Hello world");
});

app.listen(8000, () => console.log("Server running"));
