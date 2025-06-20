import { exaTools } from "./exa/index"
import { tmdbTools } from "./tmdb/index"

export const TOOL_REGISTRY = {
  ...exaTools,
  ...tmdbTools,
  // future: ...githubTools, ...huggingfaceTools, etc.
}

export type ToolId = keyof typeof TOOL_REGISTRY

export const getAvailableTools = () =>
  Object.entries(TOOL_REGISTRY)
    .filter(([, tool]) => tool.isAvailable)
    .map(([id, tool]) => ({ ...tool, id }))

export const getAllTools = () =>
  Object.entries(TOOL_REGISTRY).map(([id, tool]) => ({
    ...tool,
    id,
  }))
