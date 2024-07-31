import { prisma } from "../../../lib/prisma";
import { redis } from "../../../lib/redis";
import { uuidSchema } from "../../../lib/uuid-schema";

export class DeleteUserService {
  async execute(userID: string) {
    uuidSchema.parse(userID);
    await prisma.user.delete({ where: { id: userID } });
    const [, keys] = await redis.scan(0, "MATCH", `contacts:${userID}:*`);
    await redis.del(keys);
  }
}
