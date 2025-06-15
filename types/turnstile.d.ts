declare module '@marsidev/react-turnstile' {
  import { ComponentType } from 'react'

  export interface TurnstileProps {
    siteKey: string
    onSuccess?: (token: string) => void
    onError?: (error?: Error) => void
    onExpire?: () => void
    onLoad?: () => void
    theme?: 'light' | 'dark' | 'auto'
    size?: 'normal' | 'compact'
    tabIndex?: number
    responseField?: boolean
    responseFieldName?: string
    id?: string
    className?: string
  }

  export const Turnstile: ComponentType<TurnstileProps>
}
