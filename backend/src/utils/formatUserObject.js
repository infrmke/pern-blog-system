const formatUserObject = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  slug: user.slug,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export default formatUserObject
