import withSessionAuthentication from '../../../../lib/middleware/session_auth'
import withMethod from '../../../../lib/middleware/method'

import { listContacts } from '../../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { tag } = req.query
  try {
    const results = await listContacts(tag)
    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), "GET")