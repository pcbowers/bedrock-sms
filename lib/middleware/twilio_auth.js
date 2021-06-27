import { twilio } from '../twilio_functions'

const withTwilioAuthentication = (handler) => {
  return async (req, res) => {
    //get session
    const validation = await twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      req.headers["x-twilio-signature"],
      process.env.NEXTAUTH_URL + req.url,
      req.body
    )

    // check if session exists
    if (!validation && process.env.NEXTAUTH_URL !== "http://localhost:3000") return res.status(401).json(JSON.stringify({ error: "user unauthorized" }))

    // return handler
    return handler(req, res)
  };
}

export default withTwilioAuthentication