import z from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(4),
});

export const registerSchema = loginSchema.extend({
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
