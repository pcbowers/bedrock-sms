import { getSession } from 'next-auth/client'
import { listContact } from '../../../src/twilio_functions'

export default async (req, res) => {
  // get session
  const session = await getSession({ req })
  const { bindingID } = req.query

  if (session) { // logged in
    try {
      const data = await listContact(bindingID)
      res.status(200)
      res.json(JSON.stringify({ body: data }))
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