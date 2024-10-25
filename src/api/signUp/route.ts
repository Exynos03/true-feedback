import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
    await dbConnect()

    try {
        const {userName, email, password} = await request.json()

        const existingUserVerifiedByUserName = await UserModel.findOne({
            userName,
            isVerify: true
        })

        if(existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "User name already taken"
            }, {status: 400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerify) {
                return Response.json({
                    success: false,
                    message: "User already exists with email"
                }, {status: 400})
            } else {
                const hasedPassword = await  bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hasedPassword
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save()
            }

        } else {
            const hasedPassword = await  bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                userName,
                email,
                password: hasedPassword,
                verifyCode: verifyCode,
                isVerify: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            userName,
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully, please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}