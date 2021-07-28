import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { getAdmin } from "../../../lib/airtable_functions"

const options = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const results = await getAdmin(user.email)
      console.log(results)
      if (results.email) {
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
