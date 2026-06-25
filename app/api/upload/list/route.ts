import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'])

async function scanImages(dir: string, baseDir: string): Promise<string[]> {
  const results: string[] = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'uploaded') {
      const subImages = await scanImages(fullPath, baseDir)
      results.push(...subImages)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTS.has(ext)) {
        const relativePath = fullPath.replace(baseDir, '').replace(/\\/g, '/')
        results.push(`/static/images${relativePath}`)
      }
    }
  }
  return results
}

async function scanUploaded(dir: string): Promise<{ path: string; filename: string }[]> {
  const results: { path: string; filename: string }[] = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTS.has(ext)) {
        results.push({
          path: `/static/images/uploaded/${entry.name}`,
          filename: entry.name,
        })
      }
    }
  }
  return results
}

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'static', 'images')
    const uploadedDir = path.join(imagesDir, 'uploaded')

    const [staticImages, uploadedImages] = await Promise.all([
      scanImages(imagesDir, imagesDir),
      scanUploaded(uploadedDir),
    ])

    const staticList = staticImages
      .filter((p) => !p.includes('/uploaded/'))
      .map((p) => ({ path: p, filename: path.basename(p) }))

    return NextResponse.json({ static: staticList, uploaded: uploadedImages })
  } catch {
    return NextResponse.json({ static: [], uploaded: [] })
  }
}
