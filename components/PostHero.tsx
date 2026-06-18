import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import ViewCount from '@/components/ViewCount'

interface PostHeroProps {
  title: string
  date: string
  lastmod?: string
  tags?: string[]
  readingTime: { text: string; minutes: number; words: number }
}

export default function PostHero({ title, date, lastmod, tags, readingTime }: PostHeroProps) {
  return (
    <div className="hero-gradient relative -mx-4 overflow-hidden px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-0 lg:rounded-2xl lg:px-8 lg:py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-white/5 blur-xl" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-5xl">
          {title}
        </h1>

        {/* Meta information */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
          {/* Published date */}
          <div className="flex items-center gap-1.5">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </div>

          {/* Last modified date */}
          {lastmod && lastmod !== date && (
            <div className="flex items-center gap-1.5">
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              <span>更新于 {formatDate(lastmod, siteMetadata.locale)}</span>
            </div>
          )}

          {/* Separator */}
          <span className="hidden sm:inline">·</span>

          {/* Reading time */}
          <div className="flex items-center gap-1.5">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>{readingTime.text}</span>
          </div>

          {/* Word count */}
          <div className="flex items-center gap-1.5">
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span>{readingTime.words} 字</span>
          </div>

          {/* View count */}
          <div className="flex items-center gap-1.5">
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <ViewCount /> 阅读
          </div>
        </div>
      </div>
    </div>
  )
}
