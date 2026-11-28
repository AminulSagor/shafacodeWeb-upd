import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email.').max(200),
  password: z.string().min(1, 'Enter your password.').max(200),
  remember: z.boolean(),
});

export type SignInInput = z.infer<typeof signInSchema>;
