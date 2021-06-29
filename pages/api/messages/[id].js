import withTwilioAuthentication from '../../../lib/middleware/twilio_auth'
import withSessionAuthentication from '../../../lib/middleware/session_auth'
import withMethod from '../../../lib/middleware/method'

import { updateLog } from '../../../lib/airtable_functions'

const handler = async (req, res) => {
  const { id } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = `TODO. Getting list of 1 broadcast. id: ${id}.`

    } else if (req.method === "POST") {
      let counts = {
        sent: 0,
        queued: 0,
        failed: 0,
        delivered: 0,
        undelivered: 0
      }

      req.body.DeliveryState.forEach(contact => {
        const status = contact.status.toLowerCase()
        counts[status] = counts[status]++
      });

      console.log(req.body) // figuring out payload

      results = await updateLog({
        id,
        body: {
          total: req.body.Count,
          data: JSON.stringify(req.body.DeliveryState),
          ...counts
        }
      })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withTwilioAuthentication(withSessionAuthentication(handler, ["POST"]), ["GET"]), ["GET", "POST"])
