import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject : 'True Feedback | Verification code',
            react : VerificationEmail( {userName, otp: verifyCode} )
        })
        return {success: true, message: 'Verification email successfully'}
    } catch (emailError) {
        console.error("Error sending verification email => ", emailError)
        return {success: false, message: 'Failed to send verfication email'}
    }
}