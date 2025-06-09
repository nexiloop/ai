"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeBackground() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Determine the actual theme being used
    const currentTheme = theme === "system" ? systemTheme : theme
    
    // Apply background color to document body
    if (currentTheme === "dark") {
      document.body.style.backgroundColor = "#151515"
      // Also update the meta theme-color for PWA
      updateMetaThemeColor("#151515")
    } else {
      document.body.style.backgroundColor = "#ffffff"
      // Also update the meta theme-color for PWA
      updateMetaThemeColor("#ffffff")
    }
  }, [theme, systemTheme, mounted])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return null
}

function updateMetaThemeColor(color: string) {
  // Update the theme-color meta tag for PWA
  let metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta')
    metaThemeColor.setAttribute('name', 'theme-color')
    document.head.appendChild(metaThemeColor)
  }
  metaThemeColor.setAttribute('content', color)
}
