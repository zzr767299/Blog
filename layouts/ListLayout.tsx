'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import PostCard from '@/components/PostCard'
import siteMetadata from '@/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {!prevPage && (
        <button
          className="cursor-auto rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400 dark:border-gray-700"
          disabled
        >
          上一页
        </button>
      )}
      {prevPage && (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="hover:border-primary-500 hover:text-primary-500 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
        >
          上一页
        </Link>
      )}
      <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        {currentPage} / {totalPages}
      </span>
      {!nextPage && (
        <button
          className="cursor-auto rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400 dark:border-gray-700"
          disabled
        >
          下一页
        </button>
      )}
      {nextPage && (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="hover:border-primary-500 hover:text-primary-500 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
        >
          下一页
        </Link>
      )}
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            {title}
          </h1>
          <div className="relative max-w-lg pt-2">
            <label>
              <span className="sr-only">搜索文章</span>
              <input
                aria-label="搜索文章"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索文章..."
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute top-4 right-4 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="grid gap-6 py-6 sm:grid-cols-2">
          {!filteredBlogPosts.length && (
            <p className="col-span-2 text-center text-gray-500 dark:text-gray-400">
              未找到相关文章
            </p>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags, images } = post as CoreContent<Blog> & {
              images?: string[]
            }
            const postSlug = path.replace('blog/', '')
            return (
              <PostCard
                key={path}
                title={title}
                slug={postSlug}
                date={date}
                summary={summary}
                tags={tags}
                images={images}
              />
            )
          })}
        </div>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
