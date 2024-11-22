import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user 

    if(!session || !session.user ) {
        return Response.json({success: false, message:"Not authenticated"}, { status: 401 })
    }

    const userId = user._id
    const {acceptMessage} = await request.json

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessage},
            {new: true}
        )

        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Fail to update user status to accept messgaes"
                },{status: 401}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Messgae acceptance status updated successfully",
                updatedUser
            },{status: 200}
        )
    }catch(e) {
        console.error("Fail to update user status to accept messgaes ", e)
        return Response.json(
            {
                success: false,
                message: "Fail to update user status to accept messgaes"
            },{status: 500}
        )
    }
}

export async function  GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user 

    if(!session || !session.user ) {
        return Response.json({success: false, message:"Not authenticated"}, { status: 401 })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{status: 404}
            )
        }
    
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },{status: 200}
        )
    } catch (e) {
        console.error("Fail to update user status to accept messgaes ", e)
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptence status"
            },{status: 500}
        )
    }
}