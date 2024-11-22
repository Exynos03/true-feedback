import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { userNameValidation } from "@/Schema/signUpSchema"
import {z} from "zod"


const userNameQuerySchema = z.object({
    userName: userNameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            userName: searchParams.get('userName')
        }

        const result = userNameQuerySchema.safeParse(queryParam)
        if(!result.success) {
            const userNameErrors = result.error.format().userName?._errors || []
            return Response.json(
                {
                    success: false,
                    message: userNameErrors?.length > 0 ? userNameErrors.join(', ') : "Invalid query parameters"
                }, {status: 400}
            )
        }

        const {userName} = result.data
        const existingVerifiedUser = await UserModel.findOne({userName, isVerify: true})

        if(existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists"
                }, {status: 400}
            )
        }

        return Response.json(
            {
                success: true,
                message: "username is unique"
            }, {status: 200}
        )
    } catch(e) {
        console.error("Error checking username ", e)
        return Response.json(
            {
                success: false,
                message: "Error checking usename"
            },{status: 500}
        )
    }
}