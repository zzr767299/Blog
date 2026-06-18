import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Image from '@/components/Image'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import PostHero from '@/components/PostHero'
import PostCopyright from '@/components/PostCopyright'
import PostNavigation from '@/components/PostNavigation'
import RelatedPosts from '@/components/RelatedPosts'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default async function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) {
  const { filePath, path, slug, date, title, tags, lastmod, readingTime, images } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        {/* Hero Section */}
        <PostHero
          title={title}
          date={date}
          lastmod={lastmod}
          tags={tags}
          readingTime={readingTime}
        />

        {/* Content + Sidebar */}
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="min-w-0">
            <div className="card-container p-6 sm:p-8">
              <div className="prose dark:prose-invert max-w-none">{children}</div>

              {/* Discuss / Edit links */}
              <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <Link
                  href={discussUrl(path)}
                  rel="nofollow"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link
                  href={editUrl(filePath)}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  View on GitHub
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8">
              <PostCopyright
                author={authorDetails[0]}
                url={`${siteMetadata.siteUrl}/blog/${slug}`}
              />
            </div>

            {/* Tags (mobile: below content) */}
            {tags && tags.length > 0 && (
              <div className="mt-8 xl:hidden">
                <div className="card-container p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            {siteMetadata.comments && (
              <div className="mt-8 text-center text-gray-700 dark:text-gray-300" id="comment">
                <div className="card-container p-6">
                  <Comments slug={slug} />
                </div>
              </div>
            )}

            {/* Post Navigation */}
            <div className="mt-8">
              <PostNavigation prev={prev} next={next} />
            </div>
          </div>

          {/* Sidebar (desktop) */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              {/* Author Info */}
              <div className="card-container p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  文章作者
                </h3>
                {authorDetails.map((author) => (
                  <div key={author.name} className="flex items-center gap-3">
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {author.name}
                      </p>
                      {author.twitter && (
                        <Link
                          href={author.twitter}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs"
                        >
                          {author.twitter
                            .replace('https://twitter.com/', '@')
                            .replace('https://x.com/', '@')}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="card-container p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blog */}
              <div className="card-container p-4">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 text-sm"
                  aria-label="Back to the blog"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                  返回博客
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Related Posts */}
      <div className="mt-12">
        <RelatedPosts currentSlug={slug} currentTags={tags} />
      </div>
    </SectionContainer>
  )
}
