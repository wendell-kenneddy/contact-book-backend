import { Request, Response } from "express";
import { LoginService } from "./services/login-service";
import { JWTHandler } from "../../lib/jwt-handler";
import { SignupService } from "./services/signup-service";

export class AuthController {
  login = async (req: Request, res: Response) => {
    const data = req.body;
    const userID = await new LoginService().execute(data);
    const { accessToken, refreshToken } = await this.generateTokens(userID);
    res.setHeader("authorization", `Bearer ${accessToken}`);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    res.json({ message: "User successfully signed in." });
  };

  signup = async (req: Request, res: Response) => {
    const data = req.body;
    const userID = await new SignupService().execute(data);
    const { accessToken, refreshToken } = await this.generateTokens(userID);
    res.setHeader("authorization", `Bearer ${accessToken}`);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    res.json({ message: "User successfully signed up." });
  };

  private async generateTokens(userID: string) {
    const accessToken = await JWTHandler.generateAccessToken(userID);
    const refreshToken = await JWTHandler.generateRefreshToken(userID);
    return { accessToken, refreshToken };
  }
}
