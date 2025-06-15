import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstileToken, getClientIP, getTurnstileErrorMessage } from '@/lib/turnstile'

/**
 * Example API route that demonstrates proper Turnstile verification
 * This can be used as a template for other auth-related API routes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { turnstileToken, email, password } = body

    // 1. Verify Turnstile token is present
    if (!turnstileToken) {
      return NextResponse.json(
        { 
          error: 'Security verification is required',
          code: 'missing-turnstile-token'
        },
        { status: 400 }
      )
    }

    // 2. Get client IP for additional security
    const clientIP = getClientIP(request)
    
    // 3. Generate idempotency key for safe retries
    const idempotencyKey = crypto.randomUUID()
    
    // 4. Verify the Turnstile token
    const verification = await verifyTurnstileToken(turnstileToken, clientIP, idempotencyKey)
    
    if (!verification.success) {
      const errorMessage = getTurnstileErrorMessage(verification['error-codes'] || [])
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'turnstile-verification-failed',
          details: verification['error-codes']
        },
        { status: 400 }
      )
    }

    // 5. Log successful verification (optional)
    console.log('Turnstile verification successful:', {
      hostname: verification.hostname,
      challenge_ts: verification.challenge_ts,
      action: verification.action
    })

    // 6. Proceed with your actual authentication logic here
    // Example: Supabase auth, database operations, etc.
    
    // For this example, just return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Authentication request verified',
        verification: {
          hostname: verification.hostname,
          timestamp: verification.challenge_ts
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Auth API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'internal-error'
      },
      { status: 500 }
    )
  }
}

// Example of using the withTurnstileVerification middleware
// import { withTurnstileVerification } from '@/lib/turnstile'
// export const POST = withTurnstileVerification(actualHandler)
