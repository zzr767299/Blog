import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center py-10">
        <div className="mb-4 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="x" href={siteMetadata.x} size={5} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={5} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={5} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{siteMetadata.author}</span>
          <span>•</span>
          <span>© {new Date().getFullYear()}</span>
          <span>•</span>
          <Link href="/" className="hover:text-primary-500">
            {siteMetadata.title}
          </Link>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          <Link
            href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
            className="hover:text-primary-500"
          >
            Powered by Tailwind Nextjs Starter Blog
          </Link>
        </div>
      </div>
    </footer>
  )
}
