import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.string().min(1, 'Please select a role')
});

export type UserFormValues = z.infer<typeof userSchema>;
