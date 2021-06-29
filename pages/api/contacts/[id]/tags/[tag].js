import withSessionAuthentication from '../../../../../lib/middleware/session_auth'
import withMethod from '../../../../../lib/middleware/method'

import { deleteTags, patchContact } from '../../../../../lib/twilio_functions'

const handler = async (req, res) => {
  const { id, tag } = req.query

  try {
    let results

    if (req.method === "DELETE") {
      results = (await deleteTags({ tags: [tag], id })).tags
    } else if (req.method === "PATCH") {
      results = (await patchContact({ tags: [tag], id })).tags
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "DELETE", "PUT", "PATCH"])