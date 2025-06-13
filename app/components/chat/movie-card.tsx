"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { TMDBMovie, TMDBTVShow, TMDBService } from "@/lib/tmdb/service"
import { CalendarBlank, Clock, Play, Star, Television } from "@phosphor-icons/react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  item: any // Using any for now since we're getting enriched data from the tool
}

export function MovieCard({ item }: MovieCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useBreakpoint(768)
  const isMovie = item.media_type === "movie" || (!item.media_type && item.title)
  
  const title = isMovie ? (item.title || item.name) : (item.name || item.title)
  const releaseDate = isMovie ? item.release_date : item.first_air_date
  const posterUrl = item.poster_url || (item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null)
  const backdropUrl = item.backdrop_url || (item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : null)
  const vlopUrl = item.streamingLinks?.vlop
  
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'TBA'
  const rating = item.vote_average ? (item.vote_average / 2).toFixed(1) : 'N/A'

  const handleStreamClick = () => {
    if (vlopUrl) {
      window.open(vlopUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const MovieCardContent = () => (
    <div className="space-y-6">
      {/* Backdrop Image */}
      {backdropUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={backdropUrl}
            alt={`${title} backdrop`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <CalendarBlank className="h-4 w-4" />
                <span>{year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}/5</span>
              </div>
              {!isMovie && (
                <div className="flex items-center gap-1">
                  <Television className="h-4 w-4" />
                  <span>TV Series</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">{title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{year}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {isMovie ? 'Movie' : 'TV Show'}
              </Badge>
            </div>
          </div>
          {posterUrl && (
            <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
        </div>

        {/* Overview */}
        {item.overview && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Overview</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.overview}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
          <div className="text-center">
            <div className="text-lg font-semibold">{rating}/5</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{item.vote_count?.toLocaleString() || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Votes</div>
          </div>
        </div>

        {/* Stream Button */}
        {vlopUrl && (
          <Button 
            onClick={handleStreamClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch on vlop.fun
          </Button>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Television className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span>{year}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </button>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle className="sr-only">{title}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 overflow-y-auto">
              <MovieCardContent />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted transition-all duration-200 hover:scale-105 hover:shadow-lg"
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-110"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Television className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>{year}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">{title}</DialogTitle>
          </DialogHeader>
          <MovieCardContent />
        </DialogContent>
      </Dialog>
    </>
  )
}
