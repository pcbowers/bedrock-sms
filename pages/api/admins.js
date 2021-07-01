import withSessionAuthentication from '../../lib/middleware/session_auth'
import withMethod from '../../lib/middleware/method'

import { getAdmins, createAdmins } from '../../lib/airtable_functions'

const handler = async (req, res) => {
  const { "function": func } = req.query
  try {
    let results

    if (req.method === "GET") {
      results = await getAdmins()
    } else if (req.method === "POST") {
      results = await createAdmins(req.body)
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "POST"])
