declare module '@marsidev/react-turnstile' {
  import { ComponentType } from 'react'

  export interface TurnstileProps {
    siteKey: string
    onSuccess?: (token: string) => void
    onError?: (error?: Error) => void
    onExpire?: () => void
    onLoad?: () => void
    theme?: 'light' | 'dark' | 'auto'
    size?: 'normal' | 'compact' | 'flexible'
    tabIndex?: number
    responseField?: boolean
    responseFieldName?: string
    id?: string
    className?: string
    // Additional properties from Cloudflare documentation
    action?: string
    cData?: string
    execution?: 'render' | 'execute'
    language?: string
    retry?: 'auto' | 'never'
    retryInterval?: number
    refreshExpired?: 'auto' | 'manual' | 'never'
    refreshTimeout?: 'auto' | 'manual' | 'never'
    appearance?: 'always' | 'execute' | 'interaction-only'
    feedbackEnabled?: boolean
    // Callback functions
    'error-callback'?: (error?: Error) => void
    'expired-callback'?: () => void
    'before-interactive-callback'?: () => void
    'after-interactive-callback'?: () => void
    'unsupported-callback'?: () => void
    'timeout-callback'?: () => void
  }

  export const Turnstile: ComponentType<TurnstileProps>
}
