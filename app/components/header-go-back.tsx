import { ArrowLeft } from "@phosphor-icons/react"
import Link from "next/link"

export function HeaderGoBack({ href = "/" }: { href?: string }) {
  return (
    <header className="p-6">
      <Link
        href={href}
        prefetch
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 inline-flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="size-4" />
        <span className="font-medium text-sm">
          Back to Chat
        </span>
      </Link>
    </header>
  )
}
