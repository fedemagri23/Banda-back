import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
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

app.use(usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
