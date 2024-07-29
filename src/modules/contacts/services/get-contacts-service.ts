import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const queryPageDataSchema = z.object({
  userID: z.string().uuid("Invalid user ID."),
  offset: z
    .number()
    .min(0, "Page offset can't be less 0.")
    .int("Page offset must be an integer."),
  size: z
    .number()
    .min(1, "Page size can't be less than 1.")
    .max(10, "Page size can't be greater than 10.")
});

export class GetContactsService {
  async execute(data: unknown) {
    const { userID, offset, size } = queryPageDataSchema.parse(data);
    const page = await prisma.contact.findMany({
      where: { owner_id: userID },
      skip: offset,
      take: size
    });

    return page;
  }
}
