"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { FilmStrip, Play, Star } from "@phosphor-icons/react"

export function FeaturesSection() {
  const { preferences, setVideoStreamingEnabled } = useUserPreferences()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FilmStrip className="h-4 w-4" />
              Video Streaming & Movie Search
              <Badge variant="secondary" className="text-xs">New</Badge>
            </h3>
            <p className="text-muted-foreground text-xs max-w-sm">
              Enable AI-powered movie and TV show search with TMDB integration. Search for movies, get recommendations, and stream directly through vlop.fun.
            </p>
          </div>
          <Switch
            checked={preferences.videoStreamingEnabled ?? true}
            onCheckedChange={setVideoStreamingEnabled}
          />
        </div>
        
        {preferences.videoStreamingEnabled && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">How it works</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ask for movie recommendations: "What are some good sci-fi movies?"</li>
                  <li>• Search for specific titles: "Find information about Inception"</li>
                  <li>• Get TV show suggestions: "Show me popular thriller series"</li>
                  <li>• Click on any result to stream instantly on vlop.fun</li>
                </ul>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                  <Star className="h-3 w-3" />
                  <span>Powered by TMDB (The Movie Database)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
