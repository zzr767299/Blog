'use client'

import { useState, useRef, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import FrontmatterPanel from './FrontmatterPanel'
import ToolbarExtras from './ToolbarExtras'
import ExportButton from './ExportButton'
import type { FrontmatterData } from './hooks/useMdxExport'

export default function EditorClient() {
  const [content, setContent] = useState('')
  const [frontmatter, setFrontmatter] = useState<FrontmatterData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    summary: '',
    draft: false,
    layout: 'PostLayout',
  })

  const pendingScrollRef = useRef<{ textarea: number; preview: number } | null>(null)

  useEffect(() => {
    if (!pendingScrollRef.current) return
    const saved = pendingScrollRef.current
    pendingScrollRef.current = null
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
        if (textarea) textarea.scrollTop = saved.textarea
        const preview = document.querySelector('.w-md-editor-preview') as HTMLElement
        if (preview) preview.scrollTop = saved.preview
      })
    })
  }, [content])

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-950">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">MDX 博客编辑器</h1>
        <ExportButton frontmatter={frontmatter} content={content} />
      </div>

      <FrontmatterPanel data={frontmatter} onChange={setFrontmatter} />

      <ToolbarExtras
        content={content}
        onContentChange={setContent}
        onSaveScroll={(pos) => {
          pendingScrollRef.current = pos
        }}
      />

      <div className="flex-1 overflow-hidden" data-color-mode="dark">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || '')}
          height="100%"
          visibleDragbar={false}
          preview="live"
        />
      </div>
    </div>
  )
}
