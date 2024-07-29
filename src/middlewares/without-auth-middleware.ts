import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../errors/authentication-error";

export function withoutAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) throw new AuthenticationError("User already signed in.");
  next();
}
