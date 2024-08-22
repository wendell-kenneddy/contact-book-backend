import { uuidSchema } from "../../..//lib/uuid-schema";
import { prisma } from "../../..//lib/prisma";

export class GetUserProfileService {
  async execute(userID: any) {
    uuidSchema.parse(userID);
    const profile = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        name: true,
        email: true
      }
    });
    return profile;
  }
}
