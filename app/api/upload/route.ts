import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
const VIDEO_EXTS = ['.mp4', '.webm', '.ogg', '.mov']
const IMAGE_MAX = 10 * 1024 * 1024
const VIDEO_MAX = 100 * 1024 * 1024

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 80)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'image'

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    const isImage = type === 'image'
    const allowedExts = isImage ? IMAGE_EXTS : VIDEO_EXTS
    const maxSize = isImage ? IMAGE_MAX : VIDEO_MAX

    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          error: `不支持的文件格式。支持: ${allowedExts.join(', ')}`,
        },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      const limit = isImage ? '10MB' : '100MB'
      return NextResponse.json({ error: `文件大小超过限制 (${limit})` }, { status: 400 })
    }

    const subDir = isImage ? 'images' : 'videos'
    const uploadDir = path.join(process.cwd(), 'public', 'static', subDir, 'uploaded')
    await mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const rand = Math.random().toString(36).substring(2, 6)
    const safeName = sanitizeFilename(file.name.replace(ext, ''))
    const filename = `${timestamp}-${safeName}-${rand}${ext}`
    const filepath = path.join(uploadDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    const publicPath = `/static/${subDir}/uploaded/${filename}`
    return NextResponse.json({ path: publicPath, filename })
  } catch (err) {
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 })
  }
}
