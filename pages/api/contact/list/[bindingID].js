import withSessionAuthentication from '../../../../lib/middleware/session_auth'
import withMethod from '../../../../lib/middleware/method'

import { listContact } from '../../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { bindingID } = req.query
  try {
    const results = await listContact(bindingID)
    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), "GET")