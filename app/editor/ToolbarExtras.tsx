'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import FileUploadZone from './FileUploadZone'

interface Props {
  content: string
  onContentChange: (text: string) => void
  onSaveScroll: (pos: { textarea: number; preview: number }) => void
}

const LANGUAGES = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'sh', label: 'Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'md', label: 'Markdown' },
  { value: '', label: '纯文本' },
]

const ALERT_TYPES = [
  { value: 'NOTE', label: '提示', color: 'text-blue-600' },
  { value: 'TIP', label: '建议', color: 'text-green-600' },
  { value: 'IMPORTANT', label: '重要', color: 'text-purple-600' },
  { value: 'WARNING', label: '警告', color: 'text-yellow-600' },
  { value: 'CAUTION', label: '注意', color: 'text-red-600' },
]

function Dropdown({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(!open)
          }
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          tabIndex={-1}
          className="absolute top-full left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <button
        aria-label="关闭"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            active === tab.key
              ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function ToolbarExtras({ content, onContentChange, onSaveScroll }: Props) {
  const [videoModal, setVideoModal] = useState(false)
  const [imageModal, setImageModal] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState<'mp4' | 'bilibili' | 'youtube'>('mp4')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload')
  const [videoTab, setVideoTab] = useState<'upload' | 'url'>('upload')

  const getTextarea = useCallback((): HTMLTextAreaElement | null => {
    return document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement | null
  }, [])

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = getTextarea()
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value
      const newValue = value.substring(0, start) + text + value.substring(end)

      const preview = document.querySelector('.w-md-editor-preview') as HTMLElement
      onSaveScroll({
        textarea: textarea.scrollTop,
        preview: preview?.scrollTop || 0,
      })

      onContentChange(newValue)
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.selectionStart = textarea.selectionEnd = start + text.length
      })
    },
    [onContentChange, getTextarea, onSaveScroll]
  )

  const insertCodeBlock = (lang: string) => {
    const code = lang ? `\`\`\`${lang}\n\n\`\`\`` : '```\n\n```'
    insertAtCursor(code)
  }

  const insertAlert = (type: string) => {
    insertAtCursor(`\n> [!${type}]\n> 内容\n`)
  }

  const insertImageUrl = () => {
    if (imageUrl) {
      insertAtCursor(`![${imageAlt || '图片描述'}](${imageUrl})`)
      setImageUrl('')
      setImageAlt('')
      setImageModal(false)
    }
  }

  const handleImageUpload = (path: string) => {
    insertAtCursor(`![图片](${path})`)
    setTimeout(() => setImageModal(false), 300)
  }

  const insertLink = () => {
    if (linkUrl) {
      insertAtCursor(`[${linkText || '链接文字'}](${linkUrl})`)
      setLinkText('')
      setLinkUrl('')
      setLinkModal(false)
    }
  }

  const insertVideoUrl = () => {
    if (!videoUrl) return
    let code = ''
    if (videoType === 'mp4') {
      code = `<video controls width="100%">\n  <source src="${videoUrl}" type="video/mp4" />\n</video>`
    } else if (videoType === 'bilibili') {
      code = `<iframe src="//player.bilibili.com/player.html?bvid=${videoUrl}&page=1" scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen style="width:100%;height:500px;" />`
    } else {
      code = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoUrl}" title="YouTube video player" frameBorder="0" allowFullScreen />`
    }
    insertAtCursor(code)
    setVideoUrl('')
    setVideoModal(false)
  }

  const handleVideoUpload = (path: string) => {
    insertAtCursor(
      `<video controls width="100%">\n  <source src="${path}" type="video/mp4" />\n</video>`
    )
    setTimeout(() => setVideoModal(false), 300)
  }

  const btnClass =
    'rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
        <span className="mr-2 text-xs font-medium text-gray-500 dark:text-gray-400">扩展:</span>

        <Dropdown trigger={<button className={btnClass}>代码块 ▾</button>}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => insertCodeBlock(lang.value)}
              className="block w-full px-4 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {lang.label}
            </button>
          ))}
        </Dropdown>

        <Dropdown trigger={<button className={btnClass}>引用块 ▾</button>}>
          {ALERT_TYPES.map((alert) => (
            <button
              key={alert.value}
              onClick={() => insertAlert(alert.value)}
              className={`block w-full px-4 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${alert.color}`}
            >
              {alert.label} [{alert.value}]
            </button>
          ))}
        </Dropdown>

        <button onClick={() => setImageModal(true)} className={btnClass}>
          插入图片
        </button>

        <button onClick={() => setLinkModal(true)} className={btnClass}>
          插入链接
        </button>

        <button onClick={() => setVideoModal(true)} className={btnClass}>
          插入视频
        </button>

        <button onClick={() => insertAtCursor('\n---\n')} className={btnClass}>
          分隔线
        </button>

        <button onClick={() => insertAtCursor('\n$$\n\n$$\n')} className={btnClass}>
          数学公式
        </button>

        <button
          onClick={() =>
            insertAtCursor('\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n')
          }
          className={btnClass}
        >
          表格
        </button>
      </div>

      {imageModal && (
        <Modal title="插入图片" onClose={() => setImageModal(false)}>
          <TabBar
            tabs={[
              { key: 'upload', label: '本地上传' },
              { key: 'url', label: 'URL 输入' },
            ]}
            active={imageTab}
            onChange={(k) => setImageTab(k as 'upload' | 'url')}
          />
          {imageTab === 'upload' ? (
            <FileUploadZone
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
              type="image"
              onUpload={handleImageUpload}
            />
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="图片 URL 或路径 (如 /static/images/xxx.png)"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="图片描述（可选）"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                onClick={insertImageUrl}
                className="bg-primary-500 hover:bg-primary-600 w-full rounded-md py-2 text-sm text-white"
              >
                插入
              </button>
            </div>
          )}
        </Modal>
      )}

      {linkModal && (
        <Modal title="插入链接" onClose={() => setLinkModal(false)}>
          <div className="space-y-3">
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="链接文字"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              onClick={insertLink}
              className="bg-primary-500 hover:bg-primary-600 w-full rounded-md py-2 text-sm text-white"
            >
              插入
            </button>
          </div>
        </Modal>
      )}

      {videoModal && (
        <Modal title="插入视频" onClose={() => setVideoModal(false)}>
          <TabBar
            tabs={[
              { key: 'upload', label: '本地上传' },
              { key: 'url', label: 'URL 输入' },
            ]}
            active={videoTab}
            onChange={(k) => setVideoTab(k as 'upload' | 'url')}
          />
          {videoTab === 'upload' ? (
            <FileUploadZone
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              type="video"
              onUpload={handleVideoUpload}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['mp4', 'bilibili', 'youtube'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setVideoType(t)}
                    className={`rounded-md px-3 py-1.5 text-sm ${
                      videoType === t
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t === 'mp4' ? 'MP4 文件' : t === 'bilibili' ? 'B站' : 'YouTube'}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={
                  videoType === 'mp4'
                    ? '视频 URL 或路径 (如 /static/videos/demo.mp4)'
                    : videoType === 'bilibili'
                      ? 'B站 BV号 (如 BV1xx411c7mD)'
                      : 'YouTube 视频 ID'
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                onClick={insertVideoUrl}
                className="bg-primary-500 hover:bg-primary-600 w-full rounded-md py-2 text-sm text-white"
              >
                插入
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
