import { z } from 'zod';

export const UserSchema = z.object({
    name: z.string({ required_error: "Este campo es obligatorio." }).max(255),
    lastname: z.string({ required_error: "Este campo es obligatorio." }).max(255),
    email: z.string({required_error:"Este campo es obligatorio."}).email(),
    phone: z.string({ required_error: "Este campo es obligatorio." },),
    idCity: z.string({ required_error: "Este campo es obligatorio."}),
    gender: z.string({ required_error: "Este campo es obligatorio." }),
});

export const ResetPasswordSchema = z.object({
    password: z.string({ required_error: "Este campo es obligatorio." }),
    confirmPassword: z.string({ required_error: "Este campo es obligatorio." }),
});

export const RequestEmailPasswordSchema = z.object({
    email: z.string({ required_error: "Este campo es obligatorio." }).email(),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string({ required_error: "Este campo es obligatorio." }),
    newPassword: z.string({ required_error: "Este campo es obligatorio." }),
    confirmPassword: z.string({ required_error: "Este campo es obligatorio." }),
});