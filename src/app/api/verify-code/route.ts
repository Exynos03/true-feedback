import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { userNameValidation } from "@/Schema/signUpSchema"
import { use } from "react"
import {z} from "zod"

export async function POST(request: Request) {
    await dbConnect()

    try{
        const {userName, code} = await request.json()
        const decodedUserName = decodeURIComponent(userName)
        const user = await UserModel.findOne({userName: decodedUserName})

        if(!user) {
            return Response.json({success: false ,message: "User not found"}, {status: 404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        
        if(isCodeValid && isCodeNotExpired) {
            user.isVerify = true
            await user.save()
            return Response.json({success: true ,message: "User verified successfully"}, {status: 200})
        } else if(!isCodeNotExpired) {
            return Response.json({success: false ,message: "Verification code has expired, please sign up to get a new code"}, {status: 400})
        } else {
            return Response.json({success: false ,message: "Invalid verification code"}, {status: 400})
        }
    } catch(e) {
        console.error("Error verifying user", e)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },{status: 500}
        )
    }
}