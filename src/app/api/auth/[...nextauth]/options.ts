import NextAuthOptions  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })
                    if(!user) {
                        throw new Error("User not found")   
                    }

                    if( !user.isVerify) {
                        throw  new Error('Please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect) return user
                    else throw new Error('Incorrect Password')

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_SECRET_KEY,
    callbacks: {
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id
                session.user.isAcceptingMessgae = token?.isAcceptingMessgae
                session.user.userName = token?.userName
                session.user.isVerify = token?.isVerify
            }
            return session
        },
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString()
                token.isAcceptingMessgae = user?.isAcceptingMessgae
                token.userName = user?.userName
                token.isVerify = user?.isVerify
            }
            return token
        }
    }
}