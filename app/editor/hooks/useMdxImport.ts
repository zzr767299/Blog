'use client'

import { useCallback, useRef } from 'react'
import yaml from 'js-yaml'
import type { FrontmatterData } from './useMdxExport'

const DEFAULT_FRONTMATTER: FrontmatterData = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  summary: '',
  draft: false,
  layout: 'PostLayout',
  images: [],
}

export function useMdxImport() {
  const inputRef = useRef<HTMLInputElement>(null)

  const parseMdx = useCallback((raw: string): { frontmatter: FrontmatterData; content: string } => {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) return { frontmatter: { ...DEFAULT_FRONTMATTER }, content: raw }

    const parsed = yaml.load(match[1]) as Record<string, unknown>
    const content = match[2].trimStart()

    const toString = (v: unknown): string => (typeof v === 'string' ? v : '')
    const toStringArray = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])
    const toBoolean = (v: unknown): boolean => v === true || v === 'true'
    const formatDate = (v: unknown): string => {
      if (v instanceof Date) return v.toISOString().split('T')[0]
      const s = toString(v)
      return s ? s.substring(0, 10) : DEFAULT_FRONTMATTER.date
    }

    const frontmatter: FrontmatterData = {
      title: toString(parsed.title),
      date: formatDate(parsed.date),
      tags: toStringArray(parsed.tags),
      summary: toString(parsed.summary),
      draft: toBoolean(parsed.draft),
      layout: toString(parsed.layout) || 'PostLayout',
      images: toStringArray(parsed.images),
    }

    return { frontmatter, content }
  }, [])

  const importMdx = useCallback(
    (onImport: (frontmatter: FrontmatterData, content: string) => void) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.mdx,.md'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
          const raw = reader.result as string
          const { frontmatter, content } = parseMdx(raw)
          onImport(frontmatter, content)
        }
        reader.readAsText(file, 'utf-8')
      }
      input.click()
    },
    [parseMdx]
  )

  return { importMdx }
}
