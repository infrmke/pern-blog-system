import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.uploadFolder || 'misc' // o handleUpload vai definir se o destino é "avatars" ou "banners"
    cb(null, path.resolve('uploads', folder))
  },
  filename: (req, file, cb) => {
    const uniquePrefix = crypto.randomBytes(10).toString('hex') // nome único para evitar conflito
    const extension = path.extname(file.originalname)

    cb(null, `${uniquePrefix}${extension}`)
  },
})

const fileFilter = (req, file, callback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Invalid file type. Use JPG, PNG or WebP.'))
  }
}

const multerConfig = {
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}

export default multerConfig
