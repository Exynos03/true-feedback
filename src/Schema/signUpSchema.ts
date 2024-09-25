import {z} from 'zod'

export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(5, {message:"Password must be atleast 5 charecters"})
})