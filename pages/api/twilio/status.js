import { getSession } from 'next-auth/client'

export default async (req, res) => {
  // get session
  const session = await getSession({ req })
  const { MessageSid, SmsSid, SmsStatus, MessageStatus, To, AccountSid, From, ApiVersion } = req.query

  if (session) { // logged in
    try {
      console.log(req.query)
      res.status(200)
      res.setHeader('Content-Type', 'text/xml')
      res.send(req.query)
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