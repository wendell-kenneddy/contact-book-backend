import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./lib/env";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware";
import { authRouter } from "./modules/auth/auth-router";
import { contactsRouter } from "./modules/contacts/contacts-router";
import { usersRouter } from "./modules/users/users-router";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.ORIGIN }));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));
app.use(authRouter);
app.use(usersRouter);
app.use(contactsRouter);
app.use(errorHandlerMiddleware);

app.listen(env.PORT, () => {
  console.log(`[server]: running on ${env.API_BASE_URL}:${env.PORT}`);
});
