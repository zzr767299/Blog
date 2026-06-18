'use client'

import { useState, useRef, useCallback } from 'react'

interface Props {
  accept: string
  type: 'image' | 'video'
  onUpload: (path: string) => void
  onError?: (msg: string) => void
}

export default function FileUploadZone({ accept, type, onUpload, onError }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setUploading(true)
      setError(null)
      setUploadedFile(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) {
          const msg = data.error || '上传失败'
          setError(msg)
          onError?.(msg)
          return
        }

        setUploadedFile(data.filename)
        onUpload(data.path)
      } catch {
        const msg = '网络错误，请重试'
        setError(msg)
        onError?.(msg)
      } finally {
        setUploading(false)
      }
    },
    [type, onUpload, onError]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      upload(files[0])
    },
    [upload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.files
      if (items.length > 0) {
        handleFiles(items)
      }
    },
    [handleFiles]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
          : 'hover:border-primary-400 dark:hover:border-primary-500 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-sm text-gray-500 dark:text-gray-400">上传中...</span>
        </div>
      ) : uploadedFile ? (
        <div className="flex flex-col items-center gap-2">
          {type === 'image' ? (
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <span className="text-sm text-green-600 dark:text-green-400">
            上传成功: {uploadedFile}
          </span>
          <span className="text-xs text-gray-400">点击或拖拽重新上传</span>
        </div>
      ) : (
        <>
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            拖拽文件到此处，或点击选择
          </span>
          <span className="text-xs text-gray-400">
            支持 {type === 'image' ? 'JPG/PNG/GIF/WebP/SVG，最大 10MB' : 'MP4/WebM，最大 100MB'}
          </span>
        </>
      )}

      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  )
}
