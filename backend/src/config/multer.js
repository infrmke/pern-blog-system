import multer from 'multer'

const storage = multer.memoryStorage()

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
