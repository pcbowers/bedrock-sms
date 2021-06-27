const withMethod = (handler, method) => {
  if (!Array.isArray(method)) method = [method]

  return async (req, res) => {
    // check if method is used
    if (!method.includes(req.method)) return res.status(405).json(JSON.stringify({ error: `endpoint only accepts ${method} requests` }))

    // return handler
    return handler(req, res)
  };
}

export default withMethod