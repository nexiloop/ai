import { tool } from "ai"
import { z } from "zod"
import { TMDBService } from "@/lib/tmdb/service"

export const movieSearchTool = tool({
  description: `
    Search for movies and TV shows using TMDB (The Movie Database).
    Use this tool when users ask about movies, TV shows, actors, or want recommendations.
    This tool provides comprehensive information including posters, ratings, descriptions, and streaming availability.
  `,
  parameters: z.object({
    query: z.string().describe("The search query for movies/TV shows"),
    type: z.enum(["movie", "tv", "multi"]).default("multi").describe("Type of content to search for"),
    year: z.number().optional().describe("Filter by release year"),
    adult: z.boolean().default(false).describe("Include adult content"),
  }),
  execute: async ({ query, type, year, adult }) => {
    try {
      const apiKey = process.env.TMDB_API_KEY
      if (!apiKey) {
        throw new Error("TMDB API key not configured")
      }

      const tmdbService = new TMDBService(apiKey)
      let searchResults: any

      // Use appropriate search method based on type
      if (type === "movie") {
        searchResults = await tmdbService.searchMovies(query)
      } else if (type === "tv") {
        searchResults = await tmdbService.searchTVShows(query)
      } else {
        searchResults = await tmdbService.searchMulti(query)
      }

      // Get detailed information for top results
      const detailedResults = await Promise.all(
        searchResults.results.slice(0, 8).map(async (item: any) => {
          try {
            if (tmdbService.isMovie(item)) {
              const details = await tmdbService.getMovieDetails(item.id)
              return {
                ...item,
                media_type: "movie",
                details,
                poster_url: tmdbService.getImageUrl(item.poster_path),
                backdrop_url: tmdbService.getBackdropUrl(item.backdrop_path),
                streamingLinks: {
                  vlop: tmdbService.generateVlopUrl(item),
                }
              }
            } else if (tmdbService.isTVShow(item)) {
              const details = await tmdbService.getTVShowDetails(item.id)
              return {
                ...item,
                media_type: "tv",
                details,
                poster_url: tmdbService.getImageUrl(item.poster_path),
                backdrop_url: tmdbService.getBackdropUrl(item.backdrop_path),
                streamingLinks: {
                  vlop: tmdbService.generateVlopUrl(item),
                }
              }
            }
            return {
              ...item,
              poster_url: tmdbService.getImageUrl(item.poster_path),
              backdrop_url: tmdbService.getBackdropUrl(item.backdrop_path),
            }
          } catch (error) {
            console.error(`Error fetching details for item ${item.id}:`, error)
            return {
              ...item,
              poster_url: tmdbService.getImageUrl(item.poster_path),
              backdrop_url: tmdbService.getBackdropUrl(item.backdrop_path),
            }
          }
        })
      )

      if (detailedResults.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: `No ${type === "multi" ? "movies or TV shows" : type === "movie" ? "movies" : "TV shows"} found for "${query}".`
          }]
        }
      }

      return {
        content: [{
          type: "movies" as const,
          results: detailedResults,
          query,
          totalResults: searchResults.total_results
        }]
      }
    } catch (error) {
      console.error("Movie search error:", error)
      return {
        content: [{
          type: "text" as const,
          text: `Sorry, I couldn't search for movies right now. Please try again later.`
        }]
      }
    }
  },
})
