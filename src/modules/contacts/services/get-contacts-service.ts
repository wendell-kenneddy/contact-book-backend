import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { redis } from "../../../lib/redis";

const queryPageDataSchema = z.object({
  userID: z.string().uuid("Invalid user ID."),
  pageIndex: z.number().min(1, "Page index can't be less than 1.")
});

export class GetContactsService {
  async execute(data: unknown) {
    const { userID, pageIndex } = queryPageDataSchema.parse(data);
    const cachedPage = await redis.get(`contacts:${userID}:${pageIndex}`);

    if (cachedPage) return JSON.parse(cachedPage);

    const page = await prisma.contact.findMany({
      where: { owner_id: userID },
      skip: (pageIndex - 1) * 10,
      take: 10,
      orderBy: {
        created_at: "desc"
      }
    });
    if (page.length) {
      await redis.set(`contacts:${userID}:${pageIndex}`, JSON.stringify(page), "EX", 60 * 60 * 24);
    }

    return page;
  }
}
