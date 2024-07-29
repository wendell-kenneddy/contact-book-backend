import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const createContactDataSchema = z.object({
  userID: z.string().uuid("Invalid ID."),
  name: z.string(),
  email: z.string().email("Invalid contact email"),
  phone_number: z.string()
});

export class CreateContactService {
  async execute(data: unknown) {
    const { userID, name, email, phone_number } = createContactDataSchema.parse(
      data
    );

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone_number,
        owner_id: userID
      },
      select: {
        id: true
      }
    });

    return contact.id;
  }
}
