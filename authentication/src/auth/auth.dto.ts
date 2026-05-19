import z from 'zod';

export const SignUpSchema = z.object({
  email: z.email('Please Provide a Valid Email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
});

export const LoginSchema = SignUpSchema.omit({
  name: true,
});

const RefereshTokenSchema = z.object({
  token: z.string().min(1, 'Refersh Token is required'),
  userId: z.string().min(1, 'UserID is required'),
  expirationDate: z.string().min(1, 'Expir'),
});

export const ChangePasswordSchema = z.object({
  OldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(1, 'New password is required'),
});
export const SendResetPasswordSchema = LoginSchema.pick({
  email: true,
});
//types
export type SignUpDto = z.infer<typeof SignUpSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RefereshTokenDTO = z.infer<typeof RefereshTokenSchema>;
export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;
export type SendResetDTO = z.infer<typeof SendResetPasswordSchema>;
