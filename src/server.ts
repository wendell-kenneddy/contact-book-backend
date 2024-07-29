import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.ORIGIN }));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

app.listen(env.PORT, () => {
  console.log(`[server]: running on ${env.API_BASE_URL}:${env.PORT}`);
});
