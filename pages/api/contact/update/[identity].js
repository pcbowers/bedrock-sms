import withSessionAuthentication from '../../../../lib/middleware/session_auth'
import withMethod from '../../../../lib/middleware/method'

import { updateContact, patchContact } from '../../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { identity } = req.query

  if (req.method === "PUT") {
    try {
      const results = await updateContact([req.body, identity])
      return res.status(200).json(JSON.stringify({ body: results }))
    } catch (error) {
      return res.status(400).json(JSON.stringify({ error: error.message }))
    }
  } else if (req.method === "PATCH") {
    try {
      const results = await patchContact([req.body, identity])
      return res.status(200).json(JSON.stringify({ body: results }))
    } catch (error) {
      return res.status(400).json(JSON.stringify({ error: error.message }))
    }
  }
}

export default withMethod(withSessionAuthentication(handler), ["PUT", "PATCH"])