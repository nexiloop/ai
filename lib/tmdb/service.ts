export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  popularity: number
}

export interface TMDBSearchResponse {
  page: number
  results: (TMDBMovie | TMDBTVShow)[]
  total_pages: number
  total_results: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number
  revenue: number
  runtime: number
  status: string
  tagline: string
  genres: TMDBGenre[]
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  spoken_languages: Array<{
    iso_639_1: string
    name: string
  }>
}

export interface TMDBTVShowDetails extends TMDBTVShow {
  created_by: Array<{
    id: number
    name: string
    profile_path: string | null
  }>
  episode_run_time: number[]
  genres: TMDBGenre[]
  homepage: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  networks: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  number_of_episodes: number
  number_of_seasons: number
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  seasons: Array<{
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string | null
    season_number: number
  }>
  status: string
  tagline: string
  type: string
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export class TMDBService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
    url.searchParams.append('api_key', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async searchMulti(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/search/multi', {
      query,
      page: page.toString(),
      include_adult: 'false'
    })
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/search/movie', {
      query,
      page: page.toString(),
      include_adult: 'false'
    })
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/search/tv', {
      query,
      page: page.toString(),
      include_adult: 'false'
    })
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.request<TMDBMovieDetails>(`/movie/${movieId}`)
  }

  async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
    return this.request<TMDBTVShowDetails>(`/tv/${tvId}`)
  }

  async getPopularMovies(page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/movie/popular', {
      page: page.toString()
    })
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/tv/popular', {
      page: page.toString()
    })
  }

  async getTrendingAll(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>(`/trending/all/${timeWindow}`)
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
    if (!path) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
    if (!path) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  isMovie(item: TMDBMovie | TMDBTVShow): item is TMDBMovie {
    return 'title' in item && 'release_date' in item
  }

  isTVShow(item: TMDBMovie | TMDBTVShow): item is TMDBTVShow {
    return 'name' in item && 'first_air_date' in item
  }

  generateVlopUrl(item: TMDBMovie | TMDBTVShow): string {
    const baseUrl = 'https://vlop.fun/media/tmdb'
    
    if (this.isMovie(item)) {
      return `${baseUrl}-movie-${item.id}`
    } else {
      return `${baseUrl}-tv-${item.id}`
    }
  }
}
