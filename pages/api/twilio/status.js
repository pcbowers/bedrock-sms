import { twilio } from "../../../lib/twilio_functions"

export default async (req, res) => {
  const validation = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    req.headers["x-twilio-signature"],
    process.env.NEXTAUTH_URL + "/api/twilio/status",
    req.body
  )

  if (validation) { // logged in
    try {
      console.log(req.body)
      res.status(200)
      res.send(req.body)
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