import { getSession } from 'next-auth/client'

const withSessionAuthentication = (handler, exceptMethods = []) => {
  return async (req, res) => {
    //get session
    const session = await getSession({ req })

    // check if session exists
    if (
      !session &&
      process.env.NEXTAUTH_URL !== "http://localhost:3000" &&
      !exceptMethods.includes(req.method)
    ) return res.status(401).json(JSON.stringify({ error: "user unauthorized" }))

    // return handler
    return handler(req, res)
  };
}

export default withSessionAuthentication
