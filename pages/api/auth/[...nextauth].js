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
    callbacks: {
        async signIn(user, account, profile) {
            const results = await (await fetch(`${process.env.NEXTAUTH_URL}/api/admins/${user.email}`)).json()
            if (results.body) {
                return true
            } else {
                return false
            }
        }
    }
}

export default function auth(req, res) {
    return NextAuth(req, res, options)
}