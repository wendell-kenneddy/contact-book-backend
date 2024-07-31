import { Request, Response } from "express";
import { DeleteUserService } from "./services/delete-user-service";

export class UsersController {
  delete = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    await new DeleteUserService().execute(userID);
    return res.json({ message: "User successfully deleted." });
  };
}
