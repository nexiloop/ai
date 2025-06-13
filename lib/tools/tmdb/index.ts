import { config as movieSearchConfig } from "./movieSearch/config"
import { movieSearchTool } from "./movieSearch/tool"

const isAvailable = (envVars: string[]) => {
  return envVars.every((v) => !!process.env[v])
}

export const tmdbTools = {
  tmdbMovieSearch: {
    ...movieSearchTool,
    isAvailable: () => isAvailable(movieSearchConfig.envVars),
  },
}
