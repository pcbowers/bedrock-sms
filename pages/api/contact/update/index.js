import withSessionAuthentication from '../../../../lib/middleware/session_auth'
import withMethod from '../../../../lib/middleware/method'

import { updateContacts, patchContacts } from '../../../../lib/twilio_functions'

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const results = await updateContacts(req.body)
      return res.status(200).json(JSON.stringify({ body: results }))
    } catch (error) {
      return res.status(400).json(JSON.stringify({ error: error.message }))
    }
  } else if (req.method === "PATCH") {
    try {
      const results = await patchContacts(req.body)
      return res.status(200).json(JSON.stringify({ body: results }))
    } catch (error) {
      return res.status(400).json(JSON.stringify({ error: error.message }))
    }
  }
}

export default withMethod(withSessionAuthentication(handler), ["PUT", "PATCH"])