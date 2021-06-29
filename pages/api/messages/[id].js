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

      let deliveryData = []

      let curDeliveryState = 0;
      while (curDeliveryState >= 0) {
        const contact = req.body[`DeliveryState[${curDeliveryState}]`]

        if (contact) {
          deliveryData.push(contact)
          counts[contact.status.toLowerCase()] += 1
          curDeliveryState++
        } else {
          curDeliveryState = -1
        }
      }

      results = await updateLog({
        id,
        body: {
          total: parseInt(req.body.Count),
          data: JSON.stringify(deliveryData),
          ...counts
        }
      })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    console.log(error.message)
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withTwilioAuthentication(withSessionAuthentication(handler, ["POST"]), ["GET"]), ["GET", "POST"])
