"use client"

import { removeBackground as imglyRemoveBackground, Config, ImageSource } from "@imgly/background-removal"

export type BackgroundRemovalConfig = Partial<Config>

const defaultConfig: Config = {
  debug: false,
  device: 'cpu', // Start with CPU for better compatibility
  model: 'isnet_fp16', // Good balance of speed and quality
  output: {
    format: 'image/png',
    quality: 0.9
  }
}

export async function removeBackground(
  imageSource: ImageSource,
  config: BackgroundRemovalConfig = {}
): Promise<Blob> {
  try {
    const finalConfig: Config = { ...defaultConfig, ...config }
    
    console.log('Removing background with config:', finalConfig)
    
    const blob = await imglyRemoveBackground(imageSource, finalConfig)
    
    console.log('Background removal completed successfully')
    return blob
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Background removal failed:', error)
    throw new Error(`Background removal failed: ${errorMessage}`)
  }
}

export function createImageFromBlob(blob: Blob): string {
  return URL.createObjectURL(blob)
}

export function downloadProcessedImage(blob: Blob, filename: string = 'background-removed.png') {
  const url = createImageFromBlob(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

// Utility to convert file to supported format
export function prepareImageForProcessing(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      resolve(file)
      return
    }
    
    // Convert non-image files using canvas if needed
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      ctx?.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert image'))
        }
      }, 'image/png')
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
