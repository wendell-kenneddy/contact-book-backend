import { SignJWT } from "jose";
import { env } from "./env";
import { createSecretKey } from "crypto";

export const accessTokenKey = createSecretKey(env.ACCESS_TOKEN_SECRET, "utf-8");
export const refreshTokenKey = createSecretKey(env.REFRESH_TOKEN_SECRET, "utf-8");

export class JWTHandler {
  static async generateAccessToken(userID: string) {
    const accessToken = await new SignJWT({ userID })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setSubject("access-token")
      .setProtectedHeader({ alg: "HS512" })
      .sign(accessTokenKey);

    return accessToken;
  }

  static async generateRefreshToken(userID: string) {
    const refreshToken = await new SignJWT({ userID })
      .setIssuedAt()
      .setExpirationTime("1d")
      .setSubject("refresh-token")
      .setProtectedHeader({ alg: "HS512" })
      .sign(refreshTokenKey);

    return refreshToken;
  }
}
