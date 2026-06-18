'use client'

import { useCallback } from 'react'

export interface FrontmatterData {
  title: string
  date: string
  tags: string[]
  summary: string
  draft: boolean
  layout: string
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

function buildFrontmatter(data: FrontmatterData): string {
  const lines: string[] = ['---']
  lines.push(`title: '${data.title}'`)
  lines.push(`date: '${data.date}'`)
  if (data.tags.length > 0) {
    lines.push(`tags: [${data.tags.map((t) => `'${t}'`).join(', ')}]`)
  }
  if (data.summary) {
    lines.push(`summary: '${data.summary}'`)
  }
  if (data.draft) {
    lines.push(`draft: true`)
  }
  if (data.layout && data.layout !== 'PostLayout') {
    lines.push(`layout: ${data.layout}`)
  }
  lines.push('---')
  return lines.join('\n')
}

export function useMdxExport() {
  const exportMdx = useCallback((frontmatter: FrontmatterData, content: string) => {
    const fm = buildFrontmatter(frontmatter)
    const mdxContent = `${fm}\n\n${content}`

    const blob = new Blob([mdxContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filename = frontmatter.title
      ? `${sanitizeFilename(frontmatter.title)}.mdx`
      : 'untitled.mdx'
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return { exportMdx }
}
