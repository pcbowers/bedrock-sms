import withSessionAuthentication from '../../../lib/middleware/session_auth'
import withMethod from '../../../lib/middleware/method'

import { getText } from '../../../lib/twilio_functions'
import { updateLogData } from '../../../lib/airtable_functions'

const handler = async (req, res) => {
  const { id } = req.query
  try {
    let results

    if (req.method === "GET") {
      results = await getText(id)
    } else if (req.method === "POST") {
      results = await updateLogData({ id, data: JSON.stringify(req.body) })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "POST"])
