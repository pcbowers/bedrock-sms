import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET_ID
        }),
    ],
}

export default function auth(req, res) {
    return NextAuth(req, res, options)
}