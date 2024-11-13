import 'next-auth'
import { DefaultSession } from 'next-auth'
import { decl } from 'postcss'

declare module 'next-auth' {
    interface User {
        _id?: string,
        isVerify?: boolean,
        isAcceptingMessgae?: boolean,
        userName?: string 
    }
    interface Session {
        user : {
            _id?: string,
            isVerify?: boolean,
            isAcceptingMessgae?: boolean,
            userName?: string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        isVerify?: boolean,
        isAcceptingMessgae?: boolean,
        userName?: string
    }
}