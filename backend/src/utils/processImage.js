import sharp from 'sharp'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// configurando __dirname pra funcionar em module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const processImage = async (file, folder, width) => {
  // gera um nome único (ex.: d39e01db0d1dda1fcc33), já com a extensão final
  const uniqueName = crypto.randomBytes(10).toString('hex')
  const newFileName = `${uniqueName}.webp`

  // define o caminho onde a imagem otimizada será salva
  const outputPath = path.resolve(__dirname, '..', 'uploads', folder, newFileName)

  console.log(outputPath)

  await sharp(file.buffer) // lê o arquivo de imagem direto da RAM
    .resize(width) // redimensiona a imagem
    .webp({ quality: 80 }) // converte para .webp com 80% de qualidade
    .toFile(outputPath)

  return newFileName
}

export default processImage
