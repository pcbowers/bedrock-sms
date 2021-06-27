import withSessionAuthentication from '../../../../lib/middleware/session_auth'
import withMethod from '../../../../lib/middleware/method'

const handler = async (req, res) => {
  const { id } = req.query
  try {
    // TODO: add broadcast history here by id
    // const results = await historyContact(identity)
    const results = `specific broadcast history for ${id} here`
    return res.status(200).json(JSON.stringify({ body: results }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ error: error.message }))
  }
}

export default withMethod(withSessionAuthentication(handler), "GET")