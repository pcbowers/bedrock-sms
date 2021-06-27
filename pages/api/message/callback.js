import withTwilioAuthentication from '../../../lib/middleware/twilio_auth'
import withMethod from '../../../lib/middleware/method'

import { twimlResponse } from '../../../lib/twilio_functions'

const handler = async (req, res) => {
  try {
    // TODO: Look up keywords 
    console.log(req.body)
    const results = await twimlResponse("responses coming soon!")
    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withTwilioAuthentication(handler), "POST")