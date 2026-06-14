'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import PostCard from '@/components/PostCard'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

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
          className="hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
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
          className="hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
        >
          下一页
        </Link>
      )}
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden h-full max-h-screen max-w-[260px] min-w-[240px] overflow-auto rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:block dark:border-gray-700 dark:bg-gray-800/60">
            {pathname.startsWith('/blog') ? (
              <h3 className="text-primary-500 mb-4 text-sm font-bold tracking-wider uppercase">
                全部文章
              </h3>
            ) : (
              <Link
                href="/blog"
                className="hover:text-primary-500 mb-4 block text-sm font-bold tracking-wider text-gray-700 uppercase transition-colors dark:text-gray-300"
              >
                全部文章
              </Link>
            )}
            <ul className="space-y-1">
              {sortedTags.map((t) => (
                <li key={t}>
                  {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                    <span className="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 block rounded-lg px-3 py-1.5 text-sm font-medium">
                      {`${t} (${tagCounts[t]})`}
                    </span>
                  ) : (
                    <Link
                      href={`/tags/${slug(t)}`}
                      className="hover:text-primary-500 dark:hover:text-primary-400 block rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                      aria-label={`View posts tagged ${t}`}
                    >
                      {`${t} (${tagCounts[t]})`}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Posts Grid */}
          <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2">
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
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
