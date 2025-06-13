import { TMDBService } from "@/lib/tmdb/service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'multi' // multi, movie, tv
    const page = parseInt(searchParams.get('page') || '1', 10)

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.TMDB_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      )
    }

    const tmdbService = new TMDBService(apiKey)
    let results

    switch (type) {
      case 'movie':
        results = await tmdbService.searchMovies(query, page)
        break
      case 'tv':
        results = await tmdbService.searchTVShows(query, page)
        break
      case 'multi':
      default:
        results = await tmdbService.searchMulti(query, page)
        break
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json(
      { error: 'Failed to search movies/TV shows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, type } = body

    const apiKey = process.env.TMDB_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      )
    }

    const tmdbService = new TMDBService(apiKey)

    if (action === 'details') {
      if (!id || !type) {
        return NextResponse.json(
          { error: 'ID and type are required for details' },
          { status: 400 }
        )
      }

      let details
      if (type === 'movie') {
        details = await tmdbService.getMovieDetails(id)
      } else if (type === 'tv') {
        details = await tmdbService.getTVShowDetails(id)
      } else {
        return NextResponse.json(
          { error: 'Invalid type. Must be "movie" or "tv"' },
          { status: 400 }
        )
      }

      return NextResponse.json(details)
    }

    if (action === 'trending') {
      const timeWindow = body.timeWindow || 'week'
      const results = await tmdbService.getTrendingAll(timeWindow as 'day' | 'week')
      return NextResponse.json(results)
    }

    if (action === 'popular') {
      const mediaType = body.mediaType || 'movie'
      const page = body.page || 1
      
      let results
      if (mediaType === 'movie') {
        results = await tmdbService.getPopularMovies(page)
      } else if (mediaType === 'tv') {
        results = await tmdbService.getPopularTVShows(page)
      } else {
        return NextResponse.json(
          { error: 'Invalid mediaType. Must be "movie" or "tv"' },
          { status: 400 }
        )
      }

      return NextResponse.json(results)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('TMDB API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
