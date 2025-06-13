"use client"

import { TMDBMovie, TMDBTVShow, TMDBService } from "@/lib/tmdb/service"
import { MovieCard } from "./movie-card"
import { FilmStrip, Television } from "@phosphor-icons/react"

interface MovieSearchResultsProps {
  results: any[]
  title?: string
  query?: string
  totalResults?: number
}

export function MovieSearchResults({ results, title, query, totalResults }: MovieSearchResultsProps) {
  const displayTitle = title || (query ? `Results for "${query}"` : "Movie & TV Results")
  
  if (!results || results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 my-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FilmStrip className="h-4 w-4" />
          <span>{displayTitle}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {totalResults ? `${results.length} of ${totalResults}` : `${results.length} result${results.length !== 1 ? 's' : ''}`}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {results.slice(0, 10).map((item, index) => (
          <MovieCard
            key={`${item.media_type || 'unknown'}-${item.id || index}`}
            item={item}
          />
        ))}
      </div>
      
      {results.length > 10 && (
        <div className="text-xs text-muted-foreground text-center py-2">
          Showing 10 of {results.length} results
        </div>
      )}
    </div>
  )
}
