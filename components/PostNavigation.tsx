import Link from '@/components/Link'
import Image from '@/components/Image'

interface PostNavigationProps {
  prev?: {
    path: string
    title: string
    images?: string[]
  }
  next?: {
    path: string
    title: string
    images?: string[]
  }
}

const defaultCover = '/static/images/twitter-card.png'

function NavCard({
  path,
  title,
  images,
  direction,
}: {
  path: string
  title: string
  images?: string[]
  direction: 'prev' | 'next'
}) {
  const coverImage = images?.[0] || defaultCover
  const label = direction === 'prev' ? '上一篇' : '下一篇'

  return (
    <Link
      href={`/${path}`}
      className="group card-container card-container-hover block overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute right-3 bottom-3 left-3">
          <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {label}
          </span>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-white sm:text-base">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {prev && prev.path ? (
        <NavCard path={prev.path} title={prev.title} images={prev.images} direction="prev" />
      ) : (
        <div />
      )}
      {next && next.path ? (
        <NavCard path={next.path} title={next.title} images={next.images} direction="next" />
      ) : (
        <div />
      )}
    </div>
  )
}
