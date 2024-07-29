import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthenticationError } from "../errors/authentication-error";
import { AuthorizationError } from "../errors/authorization-error";
import { ClientError } from "../errors/client-error";
import { env } from "../lib/env";

export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (env.NODE_ENV == "development") console.log(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid input.",
      errors: err.flatten().fieldErrors
    });
  }

  if (err instanceof ClientError) {
    return res.status(400).json({
      message: err.message ?? "Invalid input."
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      message: err.message ?? "Unauthenticated access denied."
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(403).json({
      message: err.message ?? "Unauthorized access denied."
    });
  }

  if (err.message.includes("Unique constraint failed on the fields: (`email`)")) {
    return res.status(400).json({
      message: "Email already in use."
    });
  }

  return res.status(500).json("Internal server error.");
}
