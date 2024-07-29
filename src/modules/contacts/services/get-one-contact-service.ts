import { z } from "zod";
import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";

const getContactDataSchema = z.object({
  userID: z.string().uuid("Invalid user ID."),
  contactID: z.string().uuid("Invalid contact ID.")
});

export class GetOneContactService {
  async execute(data: unknown) {
    const { userID, contactID } = getContactDataSchema.parse(data);
    const contact = await prisma.contact.findUnique({ where: { id: contactID, owner_id: userID } });
    if (!contact) throw new ClientError("Contact not found.");
    return contact;
  }
}
