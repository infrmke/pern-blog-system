import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// configurando __dirname pra funcionar em module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const verifyUploadFolders = () => {
  const baseUploadsPath = path.resolve(__dirname, '..', 'uploads')
  const subfolders = ['avatars', 'banners']

  subfolders.forEach((folder) => {
    const targetPath = path.resolve(baseUploadsPath, folder)

    // caso a subpasta não exista, cria ela
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true }) // cria "uploads" se ela não existir e então a subpasta
      console.log(`[API] Folder created/verified: uploads/${folder}`)
    }
  })
}

export default verifyUploadFolders
