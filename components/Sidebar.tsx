import Link from './Link'
import Image from './Image'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'

interface SidebarProps {
  recentPosts?: { title: string; slug: string }[]
}

export default function Sidebar({ recentPosts = [] }: SidebarProps) {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Author Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/60">
          <div className="from-primary-400 to-primary-600 h-20 bg-gradient-to-r" />
          <div className="-mt-10 px-5 pb-5 text-center">
            <Image
              src="/static/images/avatar.png"
              alt={siteMetadata.author}
              width={80}
              height={80}
              className="mx-auto rounded-full border-4 border-white dark:border-gray-800"
            />
            <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
              {siteMetadata.author}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="x" href={siteMetadata.x} size={5} />
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/60">
            <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-gray-100">
              最近文章
            </h3>
            <ul className="space-y-2.5">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group hover:text-primary-500 dark:hover:text-primary-400 flex items-start gap-2 text-sm text-gray-600 transition-colors dark:text-gray-400"
                  >
                    <span className="bg-primary-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="line-clamp-2 leading-tight">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/60">
          <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-gray-100">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedTags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${slug(tag)}`}
                className="hover:bg-primary-500 dark:hover:bg-primary-500 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {tag}
                <span className="ml-1 text-gray-400 dark:text-gray-500">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
