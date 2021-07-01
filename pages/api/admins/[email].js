import withSessionAuthentication from '../../../lib/middleware/session_auth'
import withMethod from '../../../lib/middleware/method'

import { getAdmin, deleteAdmin, updateAdmin } from '../../../lib/airtable_functions'

const handler = async (req, res) => {
  const { email } = req.query
  try {
    let results

    if (req.method === "GET") {
      results = await getAdmin(email)
    } else if (req.method === "DELETE") {
      results = await deleteAdmin(email)
    } else if (req.method === "PUT") {
      results = await updateAdmin({ email, phone: req.body })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "DELETE", "PUT"])
