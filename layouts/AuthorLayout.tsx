import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <>
      <div className="pt-6 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
          关于
        </h1>
      </div>
      <div className="items-start gap-8 xl:grid xl:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/60">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={192}
              height={192}
              className="ring-primary-100 dark:ring-primary-900/30 h-40 w-40 rounded-full ring-4"
            />
          )}
          <h3 className="pt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          {occupation && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{occupation}</div>
          )}
          {company && <div className="text-sm text-gray-500 dark:text-gray-400">{company}</div>}
          <div className="mt-4 flex gap-3">
            {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
            {github && <SocialIcon kind="github" href={github} />}
            {linkedin && <SocialIcon kind="linkedin" href={linkedin} />}
            {twitter && <SocialIcon kind="x" href={twitter} />}
            {bluesky && <SocialIcon kind="bluesky" href={bluesky} />}
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2 xl:pt-0">
          {children}
        </div>
      </div>
    </>
  )
}
