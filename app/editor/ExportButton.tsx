'use client'

import type { FrontmatterData } from './hooks/useMdxExport'
import { useMdxExport } from './hooks/useMdxExport'

interface Props {
  frontmatter: FrontmatterData
  content: string
}

export default function ExportButton({ frontmatter, content }: Props) {
  const { exportMdx } = useMdxExport()

  const canExport = frontmatter.title.trim() !== '' && content.trim() !== ''

  return (
    <button
      onClick={() => exportMdx(frontmatter, content)}
      disabled={!canExport}
      title={!canExport ? '请填写标题和内容' : '导出 MDX 文件'}
      className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      导出 MDX
    </button>
  )
}
