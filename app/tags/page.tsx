import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '标签', description: '文章标签' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="pt-6 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
          标签
        </h1>
      </div>
      <div className="flex flex-wrap gap-3">
        {tagKeys.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
        )}
        {sortedTags.map((t) => {
          return (
            <Link
              key={t}
              href={`/tags/${slug(t)}`}
              className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-primary-500 hover:text-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
              aria-label={`View posts tagged ${t}`}
            >
              {t}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400">
                {tagCounts[t]}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
