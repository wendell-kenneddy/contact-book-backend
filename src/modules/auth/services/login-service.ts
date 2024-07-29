import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { ClientError } from "../../../errors/client-error";
import { compare } from "bcrypt";

const loginDataSchema = z.object({
  email: z.string().email("Invalid user email."),
  password: z.string().min(8, "Password must be at least 8 characters long.")
});

export class LoginService {
  async execute(data: unknown) {
    const { email, password } = loginDataSchema.parse(data);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ClientError("User not found.");
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) throw new ClientError("Incorrect password.");
    return user.id;
  }
}
