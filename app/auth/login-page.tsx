"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithGoogle } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"

import Link from "next/link"
import { useState } from "react"
import { HeaderGoBack } from "../components/header-go-back"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSignInWithGoogle() {
    const supabase = createClient()

    if (!supabase) {
      throw new Error("Supabase is not configured")
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await signInWithGoogle(supabase)

      // Redirect to the provider URL
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err)
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEmailAuth() {
    const supabase = createClient()

    if (!supabase) {
      throw new Error("Supabase is not configured")
    }

    try {
      setIsEmailLoading(true)
      setError(null)

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          setError(error.message)
        } else {
          setError("Check your email for a confirmation link!")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        } else {
          window.location.href = "/"
        }
      }
    } catch (err: unknown) {
      console.error("Error with email auth:", err)
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      <HeaderGoBack href="/" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              Welcome to Nexiloop
            </h1>
            <p className="text-muted-foreground mt-3">
              Sign in to unlock your full potential with higher message limits.
            </p>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailLoading || isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isEmailLoading || isLoading}
              />
            </div>
            <Button
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleEmailAuth}
              disabled={isEmailLoading || isLoading || !email || !password}
            >
              {isEmailLoading 
                ? "Processing..." 
                : isSignUp 
                  ? "Sign Up" 
                  : "Sign In"
              }
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                disabled={isEmailLoading || isLoading}
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="secondary"
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleSignInWithGoogle}
              disabled={isLoading || isEmailLoading}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2 size-4"
              />
              <span>
                {isLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </Button>
          </div>
        </div>
      </main>

    <footer className="text-muted-foreground py-6 text-center text-sm">
  <p>
    By signing in, you agree to the{" "}
    <Link
      href="https://www.nexiloop.com/docs/legal/terms-conditions"
      className="text-foreground hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link
      href="https://www.nexiloop.com/docs/legal/privacy-policy"
      className="text-foreground hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </Link>
    .
  </p>
</footer>

    </div>
  )
}
