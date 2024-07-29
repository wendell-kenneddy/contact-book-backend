import Router from "express-promise-router";
import { AuthController } from "./auth-controller";
import { withoutAuthMiddleware } from "../../middlewares/without-auth-middleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/auth/login", withoutAuthMiddleware, authController.login);
authRouter.post("/auth/signup", withoutAuthMiddleware, authController.signup);

export { authRouter };
