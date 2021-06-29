import withTwilioAuthentication from '../../../lib/middleware/twilio_auth'
import withSessionAuthentication from '../../../lib/middleware/session_auth'
import withMethod from '../../../lib/middleware/method'

import { updateLog } from '../../../lib/airtable_functions'

const handler = async (req, res) => {
  const { id } = req.query

  console.log(req.body)
  console.log(req.body.Count)
  console.log(req.body["DeliveryState[0]"])

  const num = 0
  for (var key in req.body) {
    if (key === `DeliveryState${num}`) {
      num++
      console.log("delivery state found")
    }
  }

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
        counts[status] += 1
      });

      console.log(req.body) // figuring out payload

      results = await updateLog({
        id,
        body: {
          total: parseInt(req.body.Count),
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
