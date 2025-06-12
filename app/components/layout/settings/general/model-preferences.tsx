"use client"

import { ModelSelector } from "@/components/common/model-selector/base"
import { MODEL_DEFAULT } from "@/lib/config"
import { useUser } from "@/lib/user-store/provider"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { SystemPromptSection } from "./system-prompt"

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
    description: "High-quality, versatile image generation"
  },
  {
    id: "@cf/lykon/dreamshaper-8-lcm",
    name: "DreamShaper 8",
    description: "Artistic and creative image generation"
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
]

export function ModelPreferences() {
  const { user, updateUser } = useUser()
  const { preferences, setDefaultImageModel, setBackgroundRemovalEnabled } = useUserPreferences()
  const [selectedModelId, setSelectedModelId] = useState<string>(
    user?.preferred_model || MODEL_DEFAULT
  )

  useEffect(() => {
    if (user?.preferred_model) {
      setSelectedModelId(user.preferred_model)
    }
  }, [user?.preferred_model])

  const handleModelSelection = async (value: string) => {
    setSelectedModelId(value)
    await updateUser({ preferred_model: value })
  }

  const handleImageModelSelection = (value: string) => {
    setDefaultImageModel(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">Preferred model</h3>
        <div className="relative">
          <ModelSelector
            selectedModelId={selectedModelId}
            setSelectedModelId={handleModelSelection}
            className="w-full"
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          This model will be used by default for new conversations.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Image generation model</h3>
        <Select value={preferences.defaultImageModel} onValueChange={handleImageModelSelection}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select image model" />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-muted-foreground text-xs">{model.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground mt-2 text-xs">
          This model will be used when generating images from chat messages.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Background Removal
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </h3>
            <p className="text-muted-foreground text-xs">
              Automatically detect and show "Remove BG" option when uploading images
            </p>
          </div>
          <Switch
            checked={preferences.backgroundRemovalEnabled}
            onCheckedChange={setBackgroundRemovalEnabled}
          />
        </div>
      </div>

      <SystemPromptSection />
    </div>
  )
}
