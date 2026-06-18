'use client'

import { useState } from 'react'
import type { FrontmatterData } from './hooks/useMdxExport'

interface Props {
  data: FrontmatterData
  onChange: (data: FrontmatterData) => void
}

const LAYOUTS = ['PostLayout', 'PostSimple', 'PostBanner']

export default function FrontmatterPanel({ data, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [tagInput, setTagInput] = useState('')

  const update = (partial: Partial<FrontmatterData>) => {
    onChange({ ...data, ...partial })
  }

  const addTag = () => {
    const tags = tagInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length > 0) {
      update({ tags: [...new Set([...data.tags, ...tags])] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    update({ tags: data.tags.filter((t) => t !== tag) })
  }

  const inputClass =
    'focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'

  return (
    <div className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span>Frontmatter 元数据</span>
        <span className="text-xs text-gray-400">{isOpen ? '收起 ▲' : '展开 ▼'}</span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="fm-title"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              标题 *
            </label>
            <input
              id="fm-title"
              type="text"
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="文章标题"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="fm-date"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              日期 *
            </label>
            <input
              id="fm-date"
              type="date"
              value={data.date}
              onChange={(e) => update({ date: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="fm-summary"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              摘要
            </label>
            <input
              id="fm-summary"
              type="text"
              value={data.summary}
              onChange={(e) => update({ summary: e.target.value })}
              placeholder="文章摘要"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="fm-tags"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              标签（逗号分隔）
            </label>
            <div className="flex gap-2">
              <input
                id="fm-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="输入标签，回车确认"
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={addTag}
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-3 py-1.5 text-sm text-white"
              >
                添加
              </button>
            </div>
            {data.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="fm-layout"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              布局
            </label>
            <select
              id="fm-layout"
              value={data.layout}
              onChange={(e) => update({ layout: e.target.value })}
              className={inputClass}
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={data.draft}
                onChange={(e) => update({ draft: e.target.checked })}
                className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                草稿（生产环境不显示）
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
