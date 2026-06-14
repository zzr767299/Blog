import Link from '@/components/Link'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const recentPosts = posts.slice(0, 5).map((p) => ({ title: p.title, slug: p.slug }))

  return (
    <>
      {/* Hero Banner */}
      <div className="relative -mt-10 overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 px-6 py-20 text-center shadow-xl dark:from-primary-800 dark:via-primary-700 dark:to-primary-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute right-10 bottom-10 h-60 w-60 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            {siteMetadata.headerTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            {siteMetadata.description}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/blog"
              className="rounded-full bg-white/20 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              全部文章
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              关于我
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="mt-10 animate-bounce">
          <svg
            className="mx-auto h-6 w-6 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-10 flex gap-8">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              <span className="inline-block h-5 w-1 rounded-full bg-primary-500" />
              最新文章
            </h2>
            {posts.length > MAX_DISPLAY && (
              <Link
                href="/blog"
                className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                查看全部 &rarr;
              </Link>
            )}
          </div>

          {/* Post Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {!posts.length && (
              <p className="col-span-2 text-center text-gray-500 dark:text-gray-400">
                暂无文章
              </p>
            )}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags, images } = post
              return (
                <PostCard
                  key={slug}
                  title={title}
                  slug={slug}
                  date={date}
                  summary={summary}
                  tags={tags}
                  images={images}
                />
              )
            })}
          </div>

          {siteMetadata.newsletter?.provider && (
            <div className="mt-12 flex items-center justify-center">
              <NewsletterForm />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar recentPosts={recentPosts} />
      </div>
    </>
  )
}
