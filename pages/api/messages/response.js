import withTwilioAuthentication from '../../../lib/middleware/twilio_auth'
import withMethod from '../../../lib/middleware/method'

import { twimlResponse } from '../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { keyword } = req.query

  try {
    let results

    if (req.method === "POST") {
      console.log(req.body) // figuring out payload
      results = await twimlResponse(`TODO. Callback function for keywords. keyword: ${keyword}.`)
    }

    res.setHeader('Content-Type', 'text/xml')
    res.status(200).send(results)
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withTwilioAuthentication(handler), ["POST"])
