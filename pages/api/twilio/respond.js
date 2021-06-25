import { respondToMessage } from '../../../src/twilio_functions'

export default async (req, res) => {
  try {
    const data = await respondToMessage(req.body)
    res.status(200)
    res.setHeader('Content-Type', 'text/xml')
    res.send(data)
  } catch (error) {
    res.status(400)
    res.json(JSON.stringify({ error: error.message }))
  }

  // end api call
  res.end()
}