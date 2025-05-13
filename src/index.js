import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import morgan from "morgan";
import { PORT } from "./config.js";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

const port = process.env.PORT || PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
