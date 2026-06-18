import Image from './Image'
import Link from './Link'
import Tag from './Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface PostCardProps {
  title: string
  slug: string
  date: string
  summary?: string
  tags?: string[]
  images?: string[]
}

const PostCard = ({ title, slug, date, summary, tags, images }: PostCardProps) => {
  const coverImage = images?.[0] || '/static/images/twitter-card.png'

  return (
    <article className="group card-container card-container-hover flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <Link href={`/blog/${slug}`} className="overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
        </div>
        <h2 className="mb-2 text-lg leading-snug font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <Link
            href={`/blog/${slug}`}
            className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            {title}
          </Link>
        </h2>
        {summary && (
          <p className="mb-3 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
            {summary}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
