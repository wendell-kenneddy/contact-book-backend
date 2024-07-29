import { z } from "zod";
import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";

const updateContactDataSchema = z.object({
  userID: z.string().uuid("Invalid user ID."),
  contactID: z.string().uuid("Invalid contact ID."),
  name: z.string(),
  email: z.string().email("Invalid contact email."),
  phone_number: z.string()
});

export class UpdateContactService {
  async execute(data: unknown) {
    const { userID, contactID, name, email, phone_number } = updateContactDataSchema.parse(data);
    const contact = await prisma.contact.findUnique({
      where: { id: contactID, owner_id: userID }
    });

    if (!contact) throw new ClientError("Contact not found.");

    await prisma.contact.update({
      where: { id: contactID, owner_id: userID },
      data: {
        name,
        email,
        phone_number,
        updated_at: new Date()
      }
    });
  }
}
