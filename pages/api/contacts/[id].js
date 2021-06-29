import withSessionAuthentication from '../../../lib/middleware/session_auth'
import withMethod from '../../../lib/middleware/method'

import { getContact, deleteContact, putContact, patchContact } from '../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { id } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = await getContact(id)
    } else if (req.method === "DELETE") {
      results = await deleteContact({ tags: req.body, id })
    } else if (req.method === "PUT") {
      results = await putContact({ tags: req.body, id })
    } else if (req.method === "PATCH") {
      results = await patchContact({ tags: req.body, id })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "DELETE", "PUT", "PATCH"])