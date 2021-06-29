import withSessionAuthentication from '../../lib/middleware/session_auth'
import withMethod from '../../lib/middleware/method'

import { getContacts, createContacts, deleteContacts, putContacts, patchContacts } from '../../lib/twilio_functions'

const handler = async (req, res) => {
  const { tag } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = await getContacts(tag)
    } else if (req.method === "POST") {
      results = await createContacts(req.body)
    } else if (req.method === "DELETE") {
      results = await deleteContacts(req.body)
    } else if (req.method === "PUT") {
      results = await putContacts(req.body)
    } else if (req.method === "PATCH") {
      results = await patchContacts(req.body)
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "POST", "DELETE", "PUT", "PATCH"])