'use client'

import { useEffect, useState } from 'react'

interface ViewCountProps {
  className?: string
}

export default function ViewCount({ className }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    document.head.appendChild(script)

    const checkViews = () => {
      const el = document.getElementById('busuanzi_value_page_pv')
      if (el && el.textContent) {
        const count = parseInt(el.textContent, 10)
        if (!isNaN(count)) {
          setViews(count)
        }
      }
    }

    const interval = setInterval(checkViews, 500)
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <span className={className}>
      <span id="busuanzi_container_page_pv" style={{ display: 'inline' }}>
        <span id="busuanzi_value_page_pv" style={{ display: 'none' }} />
        {views !== null ? views.toLocaleString() : '...'}
      </span>
    </span>
  )
}
