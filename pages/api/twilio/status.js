import { twilio } from "../../../src/twilio_functions"

export default async (req, res) => {
  // const { MessageSid, SmsSid, SmsStatus, MessageStatus, To, AccountSid, From, ApiVersion } = req.query
  console.log(req.query)
  if (twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    req.headers["x-twilio-signature"],
    req.body,
    process.env.NEXTAUTH_URL + "/api/twilio/status"
  )) { // logged in
    try {
      console.log(req.query)
      res.status(200)
      res.setHeader('Content-Type', 'text/xml')
      res.send(req.query)
    } catch (error) {
      res.status(400)
      res.json(JSON.stringify({ error: error.message }))
    }
  } else { // logged out
    res.status(401)
    res.json(JSON.stringify({ error: "user unauthorized" }))
  }

  // end api call
  res.end()
}