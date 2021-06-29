import withSessionAuthentication from '../../lib/middleware/session_auth'
import withMethod from '../../lib/middleware/method'

import { createMessages } from '../../lib/twilio_functions'

const handler = async (req, res) => {
  const { tag } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = `TODO. Getting list of broadcasts. Filtering by ${tag} (no tag means no filtering).`
    } else if (req.method === "POST") {
      results = await createMessages(req.body)
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "POST"])