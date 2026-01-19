import processImage from '../utils/processImage.js'

const optimizeImage = async (req, res, next) => {
  if (!req.file) return next()

  try {
    // define larguras diferentes para avatar e banner
    const width = req.uploadFolder === 'avatars' ? 500 : 1200

    // processa a imagem e a atualiza com .webp
    const optimizedName = await processImage(req.file, req.uploadFolder, width)
    req.file.filename = optimizedName // passa o arquivo para o controller

    next()
  } catch (error) {
    next(error)
  }
}

export default optimizeImage
