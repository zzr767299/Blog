'use client'

import { useState, useCallback } from 'react'
import type { FrontmatterData } from './hooks/useMdxExport'

interface Props {
  data: FrontmatterData
  onChange: (data: FrontmatterData) => void
}

const LAYOUTS = ['PostLayout', 'PostSimple', 'PostBanner']
const DEFAULT_COVER = '/static/images/twitter-card.png'

export default function FrontmatterPanel({ data, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [imageList, setImageList] = useState<{
    static: { path: string; filename: string }[]
    uploaded: { path: string; filename: string }[]
  }>({ static: [], uploaded: [] })
  const [imageLoading, setImageLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const update = useCallback(
    (partial: Partial<FrontmatterData>) => {
      onChange({ ...data, ...partial })
    },
    [data, onChange]
  )

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

  const coverImage = data.images[0] || ''

  const handleUploadCover = useCallback(
    async (file: File) => {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const result = await res.json()
        if (res.ok && result.path) {
          update({ images: [result.path] })
        }
      } finally {
        setUploading(false)
      }
    },
    [update]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleUploadCover(file)
      e.target.value = ''
    },
    [handleUploadCover]
  )

  const openImagePicker = async () => {
    setImagePickerOpen(true)
    setImageLoading(true)
    try {
      const res = await fetch('/api/upload/list')
      const data = await res.json()
      setImageList(data)
    } finally {
      setImageLoading(false)
    }
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

          <div className="sm:col-span-2 lg:col-span-3">
            <div className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              封面图
            </div>
            <div className="flex items-start gap-4">
              <div className="relative aspect-[16/9] w-40 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage || DEFAULT_COVER}
                  alt="封面预览"
                  className="h-full w-full object-cover"
                />
                {!coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-xs font-medium text-white">默认封面</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="cover-upload-input"
                  />
                  <button
                    onClick={() => document.getElementById('cover-upload-input')?.click()}
                    disabled={uploading}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {uploading ? '上传中...' : '上传新图'}
                  </button>
                </div>
                <button
                  onClick={openImagePicker}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  从已有选择
                </button>
                {coverImage && (
                  <button
                    onClick={() => update({ images: [] })}
                    className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    清除封面
                  </button>
                )}
                {coverImage && (
                  <span className="max-w-xs truncate text-xs text-gray-400">{coverImage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {imagePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <button
            aria-label="关闭"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setImagePickerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="选择封面图"
            className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">选择封面图</h3>
              <button
                onClick={() => setImagePickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {imageLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              ) : (
                <>
                  {imageList.uploaded.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        已上传图片
                      </h4>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {imageList.uploaded.map((img) => (
                          <button
                            key={img.path}
                            onClick={() => {
                              update({ images: [img.path] })
                              setImagePickerOpen(false)
                            }}
                            className="group hover:border-primary-500 dark:hover:border-primary-400 relative aspect-[16/9] overflow-hidden rounded border border-gray-200 dark:border-gray-600"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.path}
                              alt={img.filename}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                              <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                选择
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {imageList.static.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        静态图片
                      </h4>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {imageList.static.map((img) => (
                          <button
                            key={img.path}
                            onClick={() => {
                              update({ images: [img.path] })
                              setImagePickerOpen(false)
                            }}
                            className="group hover:border-primary-500 dark:hover:border-primary-400 relative aspect-[16/9] overflow-hidden rounded border border-gray-200 dark:border-gray-600"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.path}
                              alt={img.filename}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                              <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                选择
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {imageList.uploaded.length === 0 && imageList.static.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">暂无可选图片</p>
                  )}
                </>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setImagePickerOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
