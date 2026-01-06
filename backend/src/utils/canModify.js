const canModify = (resource, user) => {
  const ownerId = resource.authorId || resource.userId
  return ownerId?.toString() === user.id.toString()
}

export default canModify
