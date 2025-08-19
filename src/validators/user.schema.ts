import z from "zod";

export const UserSchema = z.object({
    name: z.string({ message: "Este campo es obligatorio." }).max(255),
    lastname: z.string({ message: "Este campo es obligatorio." }).max(255),
    email: z.string({ message: "Este campo es obligatorio." }).email(),
    phone: z.string({ message: "Este campo es obligatorio." }),
    idCity: z.string({ message: "Este campo es obligatorio." }),
    gender: z.string({ message: "Este campo es obligatorio." }),
});

export const ResetPasswordSchema = z.object({
    password: z.string({ message: "Este campo es obligatorio." }),
    confirmPassword: z.string({ message: "Este campo es obligatorio." }),
});

export const RequestEmailPasswordSchema = z.object({
    email: z.string({ message: "Este campo es obligatorio." }).email(),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string({ message: "Este campo es obligatorio." }),
    newPassword: z.string({ message: "Este campo es obligatorio." }),
    confirmPassword: z.string({ message: "Este campo es obligatorio." }),
});