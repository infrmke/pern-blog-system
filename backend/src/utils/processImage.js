import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const processImage = async (file, folder, width) => {
  const { filename, path: tempPath } = file

  // mudando a extensão pra .webp
  const newFileName = filename.replace(/\.[^.]+$/, '.webp')
  const outputPath = path.resolve('uploads', folder, newFileName) // definindo o caminho da imagem

  await sharp(tempPath)
    .resize(width) // redimensionando a imagem
    .webp({ quality: 80 }) // converte para .webp com 80% de qualidade
    .toFile(outputPath)

  // deleta o arquivo original (jpeg/png) que o multer salvou
  await fs.unlink(tempPath).catch(() => null)

  return newFileName
}

export default processImage
