import { writeFile } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uuidv4() + '-' + file.name.replace(/\s+/g, '_')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  if (!fs.existsSync(uploadDir)) {
    await fs.promises.mkdir(uploadDir, { recursive: true })
  }

  await writeFile(path.join(uploadDir, fileName), buffer)

  return NextResponse.json({
    link: `/uploads/${fileName}`,
  })
}
