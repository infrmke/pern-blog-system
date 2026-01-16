import multer from 'multer'
import multerConfig from '../config/multer.js'

const upload = multer(multerConfig)

/**
 * Define que o upload irá para a pasta "avatars".
 */
const uploadAvatar = (req, res, next) => {
  req.uploadFolder = 'avatars'
  return upload.single('avatar')(req, res, next)
}

/**
 * Define que o upload irá para a pasta "banners".
 */
const uploadBanner = (req, res, next) => {
  req.uploadFolder = 'banners'
  return upload.single('banner')(req, res, next)
}

export { uploadAvatar, uploadBanner }
