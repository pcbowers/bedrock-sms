import { getSession } from 'next-auth/client'
import { respondToMessage } from '../../../src/twilio_functions'

export default async (req, res) => {
  // get session
  const session = await getSession({ req })
  const { body } = req.query

  if (session) { // logged in
    try {
      const data = await respondToMessage(body)
      res.status(200)
      res.setHeader('Content-Type', 'text/xml')
      res.send(data)
    } catch (error) {
      res.status(400)
      res.json(JSON.stringify({ error: error.message }))
    }
  } else { // logged out
    res.status(401)
    res.json(JSON.stringify({ error: "user unauthorized" }))
  }

  // end api call
  res.end()
}