import z from "zod";
import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";

const deleteContactDataSchema = z.object({
  userID: z.string().uuid("Invalid user ID."),
  contactID: z.string().uuid("Invalid contact ID.")
});

export class DeleteContactService {
  async execute(data: unknown) {
    const { userID, contactID } = deleteContactDataSchema.parse(data);
    const contact = await prisma.contact.findUnique({
      where: { id: contactID, owner_id: userID }
    });

    if (!contact) throw new ClientError("Contact not found.");

    await prisma.contact.delete({ where: { id: contactID, owner_id: userID } });
  }
}
