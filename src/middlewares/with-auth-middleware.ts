import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { JWSInvalid, JWSSignatureVerificationFailed, JWTExpired, JWTInvalid } from "jose/errors";
import { AuthenticationError } from "../errors/authentication-error";
import { accessTokenKey, JWTHandler, refreshTokenKey } from "../lib/jwt-handler";

export async function withAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) throw new AuthenticationError("No Access Token provided.");
  const accessToken = authorizationHeader.replace("Bearer ", "");

  try {
    const accessTokenVerification = await jwtVerify<{ userID: string }>(
      accessToken,
      accessTokenKey
    );
    (req as any).userID = accessTokenVerification.payload.userID;
  } catch (error) {
    console.log(error);
    if (
      error instanceof JWTInvalid ||
      error instanceof JWSInvalid ||
      JWSSignatureVerificationFailed
    )
      throw new AuthenticationError("Invalid Access Token.");
    if (error instanceof JWTExpired) {
      const refreshToken = req.signedCookies["refresh-token"];
      if (!refreshToken) throw new AuthenticationError("No Refresh Token provided.");

      try {
        const refreshTokenVerification = await jwtVerify<{ userID: string }>(
          refreshToken,
          refreshTokenKey
        );
        const newAccessToken = await JWTHandler.generateAccessToken(
          refreshTokenVerification.payload.userID
        );
        const newRefreshToken = await JWTHandler.generateRefreshToken(
          refreshTokenVerification.payload.userID
        );

        (req as any).userID = refreshTokenVerification.payload.userID;
        res.setHeader("authorization", `Bearer ${newAccessToken}`);
        res.cookie("refresh-token", newRefreshToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
        });
        next();
      } catch (error) {
        if (
          error instanceof JWTInvalid ||
          error instanceof JWSInvalid ||
          error instanceof JWSSignatureVerificationFailed
        )
          return res.status(401).json({ message: "Invalid Refresh Token." });
        if (error instanceof JWTExpired)
          return res.status(401).json({ message: "Refresh Token expired." });
      }
    }
  }

  next();
}
