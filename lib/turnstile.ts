/**
 * Verify Cloudflare Turnstile token on the server
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured')
    return true // Allow in development
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

/**
 * Middleware to check Turnstile token in API routes
 */
export function withTurnstileVerification(handler: Function) {
  return async (req: Request) => {
    try {
      const body = await req.json()
      const turnstileToken = body.turnstileToken

      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ error: 'Turnstile token required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const isValid = await verifyTurnstileToken(turnstileToken)
      
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'Invalid Turnstile token' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Token is valid, proceed with the handler
      return handler(req)
    } catch (error) {
      console.error('Turnstile middleware error:', error)
      return new Response(
        JSON.stringify({ error: 'Security verification failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}
