"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Image, Sparkles } from "lucide-react"
import { useUser } from "@/lib/user-store/provider"
import { toast } from "@/components/ui/toast"
import { DAILY_IMAGE_GENERATION_LIMIT } from "@/lib/config"

const IMAGE_MODELS = [
  {
    id: "@cf/black-forest-labs/flux-1-schnell",
    name: "FLUX.1 Schnell",
    description: "Ultra-fast text-to-image with exceptional quality"
  },
  {
    id: "@cf/bytedance/stable-diffusion-xl-lightning",
    name: "SDXL Lightning",
    description: "Lightning-fast, high-quality 1024px images"
  },
  {
    id: "@cf/ideogram-ai/ideogram-v2-turbo",
    name: "Ideogram v2 Turbo",
    description: "Creative generation with excellent text rendering"
  },
  {
    id: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL",
    description: "High-quality, detailed image generation"
  },
  {
    id: "@cf/lykon/dreamshaper-8-lcm",
    name: "DreamShaper 8",
    description: "Photorealistic images with artistic flair"
  },
  {
    id: "@cf/prompthero/openjourney-v4",
    name: "OpenJourney v4",
    description: "Artistic generation in Midjourney style"
  },
  {
    id: "@cf/tencent/hunyuan-dit",
    name: "Hunyuan DiT",
    description: "High-quality transformer-based generation"
  },
  {
    id: "@cf/runwayml/stable-diffusion-v1-5-inpainting",
    name: "SD 1.5 Inpainting",
    description: "Edit and modify existing images"
  },
  {
    id: "@cf/runwayml/stable-diffusion-v1-5-img2img",
    name: "SD 1.5 Img2Img",
    description: "Generate from input images"
  }
]

type ImageGeneratorProps = {
  onClose?: () => void
}

export function ImageGenerator({ onClose }: ImageGeneratorProps = {}) {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState(IMAGE_MODELS[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [remainingGenerations, setRemainingGenerations] = useState(DAILY_IMAGE_GENERATION_LIMIT)
  const { user } = useUser()
  const isAuthenticated = !!user

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        status: "error",
      })
      return
    }

    if (!isAuthenticated) {
      toast({
        title: "Please sign in to generate images",
        status: "error",
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel,
          userId: user?.id,
          isAuthenticated,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: `Daily limit reached! You can generate ${data.limit} images per day.`,
            status: "error",
          })
        } else {
          toast({
            title: data.error || "Failed to generate image",
            status: "error",
          })
        }
        return
      }

      setGeneratedImage(data.imageUrl)
      setRemainingGenerations(data.remainingGenerations)
      toast({
        title: "Image generated successfully!",
        status: "success",
      })

    } catch (error) {
      console.error("Image generation error:", error)
      toast({
        title: "Failed to generate image",
        status: "error",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h2 className="text-xl font-semibold">AI Image Generator</h2>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
          Beta
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generate Images</span>
            <div className="text-sm text-muted-foreground">
              {remainingGenerations} / {DAILY_IMAGE_GENERATION_LIMIT} remaining today
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !isAuthenticated || remainingGenerations <= 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground text-center">
              Sign in to generate images
            </p>
          )}
        </CardContent>
      </Card>

      {/* Loading Animation */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                  {/* Cool shader-like animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse animation-delay-200"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-500/20 to-transparent animate-pulse animation-delay-400"></div>
                    
                    {/* Animated shader lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse animation-delay-300"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-pink-500 animate-pulse animation-delay-100"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 animate-pulse animation-delay-500"></div>
                    
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 bg-white/10 dark:bg-black/10 rounded-full backdrop-blur-sm">
                        <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">Creating your image...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Image */}
      {generatedImage && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img 
                src={generatedImage} 
                alt="Generated image" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = generatedImage
                    link.download = `generated-image-${Date.now()}.png`
                    link.click()
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedImage)
                    toast({
                      title: "Image URL copied to clipboard",
                      status: "success",
                    })
                  }}
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
