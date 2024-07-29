import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { hash } from "bcrypt";

const signupDataSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid user email."),
  password: z.string().min(8, "Password must be at least 8 characters long.")
});

export class SignupService {
  async execute(data: unknown) {
    const { name, email, password } = signupDataSchema.parse(data);
    const hashedPassword = await hash(password, 10);
    const { id } = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true }
    });
    return id;
  }
}
