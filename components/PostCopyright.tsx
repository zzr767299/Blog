import Link from '@/components/Link'
import Image from '@/components/Image'

interface PostCopyrightProps {
  author: {
    name: string
    avatar?: string
  }
  url: string
}

export default function PostCopyright({ author, url }: PostCopyrightProps) {
  return (
    <div className="card-container p-6">
      {/* Author info */}
      <div className="flex items-center gap-4">
        {author.avatar && (
          <Image
            src={author.avatar}
            width={48}
            height={48}
            alt={author.name}
            className="h-12 w-12 rounded-full"
          />
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{author.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">本文作者</p>
        </div>
      </div>

      {/* Copyright info */}
      <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-200">文章链接：</span>
          <Link
            href={url}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {url}
          </Link>
        </p>
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-200">版权声明：</span>
          本博客所有文章除特别声明外，均采用{' '}
          <Link
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </Link>{' '}
          许可协议。转载请注明出处！
        </p>
      </div>
    </div>
  )
}
