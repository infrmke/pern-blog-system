const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Administrator privilege is required for this action.',
    })
  }

  return next()
}

export default isAdmin
