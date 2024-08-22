import { Request, Response } from "express";
import { DeleteUserService } from "./services/delete-user-service";
import { GetUserProfileService } from "./services/get-user-profile-service";

export class UsersController {
  getProfile = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const profile = await new GetUserProfileService().execute(userID);
    return res.json({ data: profile });
  };

  delete = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    await new DeleteUserService().execute(userID);
    return res.json({ message: "User successfully deleted." });
  };
}
