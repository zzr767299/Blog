import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-primary-500 text-8xl font-extrabold tracking-tight">404</h1>
      <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">页面未找到</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">别担心，回到首页看看吧</p>
      <Link
        href="/"
        className="bg-primary-500 hover:bg-primary-600 mt-8 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}
