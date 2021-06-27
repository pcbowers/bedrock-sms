const withMethod = (handler, method) => {
  return async (req, res) => {

    // check if session exists
    if (req.method !== method) return res.status(405).json(JSON.stringify({ error: `endpoint only accepts ${method} requests` }))

    // return handler
    return handler(req, res)
  };
}

export default withMethod