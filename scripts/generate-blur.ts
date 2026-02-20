import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, '..', 'public', 'images')
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const BLUR_SUFFIX = '-blur'
const BLUR_WIDTH = 20
const BLUR_QUALITY = 50

async function findImages(dir: string): Promise<string[]> {
  const results: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findImages(fullPath))
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      const name = basename(entry.name, ext)
      if (SUPPORTED_EXTENSIONS.has(ext) && !name.endsWith(BLUR_SUFFIX)) {
        results.push(fullPath)
      }
    }
  }

  return results
}

function getBlurPath(imagePath: string): string {
  const ext = extname(imagePath)
  const name = basename(imagePath, ext)
  const dir = dirname(imagePath)
  return join(dir, `${name}${BLUR_SUFFIX}.jpg`)
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  console.log(`Scanning ${IMAGES_DIR} for images...`)

  const images = await findImages(IMAGES_DIR)
  let generated = 0
  let skipped = 0

  for (const imagePath of images) {
    const blurPath = getBlurPath(imagePath)

    if (await fileExists(blurPath)) {
      skipped++
      continue
    }

    await sharp(imagePath)
      .resize(BLUR_WIDTH)
      .jpeg({ quality: BLUR_QUALITY })
      .toFile(blurPath)

    generated++
    const rel = imagePath.replace(IMAGES_DIR, '')
    console.log(`  Generated: ${rel} → ${basename(blurPath)}`)
  }

  console.log(`\nDone. Generated: ${generated}, Skipped (already exist): ${skipped}`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
