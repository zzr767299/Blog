import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="w-full p-3 md:w-1/2">
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/60 dark:hover:shadow-primary-900/20">
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                alt={title}
                src={imgSrc}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        ) : (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              alt={title}
              src={imgSrc}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      <div className="p-5">
        <h2 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {href ? (
            <Link
              href={href}
              aria-label={`Link to ${title}`}
              className="transition-colors hover:text-primary-500 dark:hover:text-primary-400"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
            aria-label={`Link to ${title}`}
          >
            了解更多 &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
