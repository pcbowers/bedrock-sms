import withSessionAuthentication from '../../lib/middleware/session_auth'
import withMethod from '../../lib/middleware/method'

import { getTags } from '../../lib/twilio_functions'

const handler = async (req, res) => {
  try {
    let results

    if (req.method === "GET") {
      results = await getTags()
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET"])
