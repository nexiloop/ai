'use client'

import { Button } from "@/components/ui/button"
import { Download } from "@phosphor-icons/react"
import { useEffect, useState } from 'react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('beforeinstallprompt event fired')
      // Don't prevent default here initially
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    console.log('Install button clicked, showing prompt')
    
    try {
      const result = await deferredPrompt.prompt()
      console.log('Prompt result:', result)
      
      const { outcome } = await deferredPrompt.userChoice
      console.log('User choice:', outcome)
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error during install prompt:', error)
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) return null

  return (
    <Button
      onClick={handleInstallClick}
      size="sm"
      variant="outline"
      className="fixed bottom-4 right-4 z-50 gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  )
}
