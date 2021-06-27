import withTwilioAuthentication from "../../../lib/middleware/twilio_auth"

const handler = async (req, res) => {
  try {
    return res.status(200).send(req.body)
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withTwilioAuthentication(handler)