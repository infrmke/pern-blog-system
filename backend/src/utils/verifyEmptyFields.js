const verifyEmptyFields = (data) => {
  const emptyField = Object.entries(data).find(
    ([key, value]) => typeof value === 'string' && value.trim() === ''
  )
  // retorna apenas o primeiro campo vazio detectado ou null
  return emptyField ? emptyField[0] : null
}

export default verifyEmptyFields
