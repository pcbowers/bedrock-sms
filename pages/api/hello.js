import { getSession } from 'next-auth/client'

export default async (req, res) => {
  // get session
  const session = await getSession({ req })

  if (session) { // logged in
    res.status(200)
    res.json(JSON.stringify({ body: "success" }))
  } else { // logged out
    res.status(401)
    res.json(JSON.stringify({ error: "user unauthorized" }))
  }

  // end api call
  res.end()
}