import Router from "express-promise-router";
import { UsersController } from "./users-controller";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.delete("/me", withAuthMiddleware, usersController.delete);

export { usersRouter };
