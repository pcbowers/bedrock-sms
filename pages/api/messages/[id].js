import { getLog, updateLog } from "../../../lib/airtable_functions"
import withMethod from "../../../lib/middleware/method"
import withSessionAuthentication from "../../../lib/middleware/session_auth"
import withTwilioAuthentication from "../../../lib/middleware/twilio_auth"

const handler = async (req, res) => {
  const { id } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = await getLog(id)
    } else if (req.method === "POST") {
      let counts = {
        sent: 0,
        queued: 0,
        failed: 0,
        delivered: 0,
        undelivered: 0
      }

      let deliveryData = []

      let curDeliveryState = 0
      while (curDeliveryState >= 0) {
        // get contact from body
        let contact = req.body[`DeliveryState[${curDeliveryState}]`]

        if (contact) {
          // deilvery state exists
          // parse JSON
          contact = JSON.parse(contact)

          // add count
          deliveryData.push(contact)
          counts[contact.status.toLowerCase()] += 1

          // check the next delivery state
          curDeliveryState++
        } else {
          // no more delivery states
          curDeliveryState = -1
        }
      }

      // add log to AT databases
      results = await updateLog({
        id,
        body: {
          total: parseInt(req.body.Count),
          data: JSON.stringify(deliveryData),
          data2: JSON.stringify(req.body),
          ...counts
        }
      })
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(
  withTwilioAuthentication(withSessionAuthentication(handler, ["POST"]), [
    "GET"
  ]),
  ["GET", "POST"]
)
