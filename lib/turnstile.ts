/**
 * Cloudflare Turnstile server-side validation
 * Following official Cloudflare documentation
 */

export interface TurnstileResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
  action?: string
  cdata?: string
  metadata?: {
    ephemeral_id?: string
  }
}

/**
 * Verify Cloudflare Turnstile token on the server
 * @param token - The token from the client-side Turnstile widget
 * @param remoteip - Optional visitor IP address for additional validation
 * @param idempotencyKey - Optional UUID for retry functionality
 */
export async function verifyTurnstileToken(
  token: string, 
  remoteip?: string,
  idempotencyKey?: string
): Promise<TurnstileResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured')
    // Return success in development mode
    if (process.env.NODE_ENV === 'development') {
      return { success: true }
    }
    return { 
      success: false, 
      'error-codes': ['missing-input-secret'] 
    }
  }

  try {
    // Prepare form data according to Cloudflare spec
    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)
    
    if (remoteip) {
      formData.append('remoteip', remoteip)
    }
    
    if (idempotencyKey) {
      formData.append('idempotency_key', idempotencyKey)
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const data: TurnstileResponse = await response.json()
    
    // Log verification results for debugging
    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes'])
    }
    
    return data
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return { 
      success: false, 
      'error-codes': ['internal-error'] 
    }
  }
}

/**
 * Get the visitor's IP address from request headers
 */
export function getClientIP(request: Request): string | undefined {
  // Check various headers for the real IP
  const headers = request.headers
  
  // Cloudflare
  const cfConnectingIP = headers.get('CF-Connecting-IP')
  if (cfConnectingIP) return cfConnectingIP
  
  // Other common headers
  const xForwardedFor = headers.get('X-Forwarded-For')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  
  const xRealIP = headers.get('X-Real-IP')
  if (xRealIP) return xRealIP
  
  return undefined
}

/**
 * Enhanced middleware to check Turnstile token in API routes
 * Includes IP validation and proper error handling
 */
export function withTurnstileVerification(handler: Function) {
  return async (req: Request) => {
    try {
      const body = await req.json()
      const turnstileToken = body.turnstileToken

      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ 
            error: 'Security verification required',
            code: 'missing-turnstile-token'
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get client IP for additional security
      const clientIP = getClientIP(req)
      
      // Generate idempotency key for retry safety
      const idempotencyKey = crypto.randomUUID()
      
      const verification = await verifyTurnstileToken(turnstileToken, clientIP, idempotencyKey)
      
      if (!verification.success) {
        const errorCodes = verification['error-codes'] || ['unknown-error']
        
        return new Response(
          JSON.stringify({ 
            error: 'Security verification failed',
            code: 'turnstile-verification-failed',
            details: errorCodes
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          }
        )
      }

      // Add verification data to request for handler access
      const enhancedRequest = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify({
          ...body,
          turnstileVerification: verification
        })
      })

      // Token is valid, proceed with the handler
      return handler(enhancedRequest)
    } catch (error) {
      console.error('Turnstile middleware error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Security verification failed',
          code: 'turnstile-middleware-error'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }
  }
}

/**
 * Validate Turnstile error codes and provide user-friendly messages
 */
export function getTurnstileErrorMessage(errorCodes: string[]): string {
  const errorMessages: Record<string, string> = {
    'missing-input-secret': 'Server configuration error. Please try again later.',
    'invalid-input-secret': 'Server configuration error. Please try again later.',
    'missing-input-response': 'Security verification is required.',
    'invalid-input-response': 'Security verification failed. Please try again.',
    'bad-request': 'Invalid request. Please refresh the page and try again.',
    'timeout-or-duplicate': 'Security verification expired. Please try again.',
    'internal-error': 'Verification service temporarily unavailable. Please try again.'
  }
  
  for (const code of errorCodes) {
    if (errorMessages[code]) {
      return errorMessages[code]
    }
  }
  
  return 'Security verification failed. Please try again.'
}
