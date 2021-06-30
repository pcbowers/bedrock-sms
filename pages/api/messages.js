import withSessionAuthentication from '../../lib/middleware/session_auth'
import withMethod from '../../lib/middleware/method'

import { createMessages } from '../../lib/twilio_functions'
import { createLogs, getLogs } from '../../lib/airtable_functions'

const handler = async (req, res) => {
  const { tag } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = await getLogs(tag)
    } else if (req.method === "POST") {
      if (!Array.isArray(req.body)) req.body = [req.body]

      let preresults = await createMessages(req.body)

      results = await createLogs(preresults.map(result => ({
        tag: result.tags[0],
        body: result.body,
        date: result.date,
        id: result.id
      })))
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), ["GET", "POST"])
