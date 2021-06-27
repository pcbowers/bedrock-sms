import withSessionAuthentication from '../../lib/middleware/session_auth'

const handler = async (req, res) => {
  return res.status(200).json(JSON.stringify({ body: "success" }))
}

export default withSessionAuthentication(handler)