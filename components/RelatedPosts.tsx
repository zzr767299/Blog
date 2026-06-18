import { allBlogs } from 'contentlayer/generated'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import PostCard from '@/components/PostCard'

interface RelatedPostsProps {
  currentSlug: string
  currentTags?: string[]
}

export default function RelatedPosts({ currentSlug, currentTags }: RelatedPostsProps) {
  const sortedPosts = allCoreContent(sortPosts(allBlogs))

  const otherPosts = sortedPosts.filter((p) => p.slug !== currentSlug && p.draft !== true)

  let relatedPosts: typeof otherPosts = []

  if (currentTags && currentTags.length > 0) {
    const tagged = otherPosts.filter(
      (p) => p.tags && p.tags.some((tag) => currentTags.includes(tag))
    )
    relatedPosts = tagged
  }

  if (relatedPosts.length < 6) {
    const remaining = otherPosts.filter((p) => !relatedPosts.includes(p))
    relatedPosts = [...relatedPosts, ...remaining]
  }

  relatedPosts = relatedPosts.slice(0, 6)

  if (relatedPosts.length === 0) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <svg
          className="text-primary-500 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0 4.179 2.25-9.75 5.25-4.179-2.25"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">相关推荐</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard
            key={post.slug}
            title={post.title}
            slug={post.slug}
            date={post.date}
            summary={post.summary}
            tags={post.tags}
            images={post.images as string[] | undefined}
          />
        ))}
      </div>
    </section>
  )
}
