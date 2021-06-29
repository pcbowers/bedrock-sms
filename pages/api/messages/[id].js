import withTwilioAuthentication from '../../../lib/middleware/twilio_auth'
import withMethod from '../../../lib/middleware/method'

const handler = async (req, res) => {
  const { id } = req.query

  try {
    let results

    if (req.method === "GET") {
      results = `TODO. Getting list of 1 broadcast. id: ${id}.`
    } else if (req.method === "POST") {
      console.log(req.body) // figuring out payload
      results = `TODO. Saving 1 broadcast. id: ${id}.`
    }

    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withTwilioAuthentication(handler), ["GET", "POST"])
