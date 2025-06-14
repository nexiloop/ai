import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { CodeHatProject, CodeHatFile, CodeHatPanelTab } from "@/app/types/codehat"

interface CodeHatState {
  // Current project state
  currentProject: CodeHatProject | null
  files: CodeHatFile[]
  selectedFile: string | null
  
  // UI state
  isPanelOpen: boolean
  activeTab: CodeHatPanelTab
  previewUrl: string | null
  
  // Actions
  setCurrentProject: (project: CodeHatProject | null) => void
  setFiles: (files: CodeHatFile[]) => void
  addFile: (file: CodeHatFile) => void
  updateFile: (fileName: string, content: string) => void
  removeFile: (fileName: string) => void
  setSelectedFile: (fileName: string | null) => void
  
  // UI actions
  togglePanel: () => void
  setPanelOpen: (open: boolean) => void
  setIsPanelOpen: (open: boolean) => void
  setActiveTab: (tab: CodeHatPanelTab) => void
  setPreviewUrl: (url: string | null) => void
  
  // Reset
  reset: () => void
}

const defaultReadmeFile: CodeHatFile = {
  name: "README.md",
  content: `# Welcome to CodeHat! 🎩

CodeHat is your AI-powered development companion that helps you build amazing projects.

## Getting Started

1. **Describe your project** - Tell me what you want to build
2. **Watch the magic** - I'll generate the code files for you
3. **Preview & customize** - See your project come to life
4. **Deploy & share** - Share your creation with the world

## Features

- 🚀 **Instant project generation** - From idea to code in seconds
- 🎨 **Modern UI components** - Beautiful, responsive designs
- 🔧 **Multiple frameworks** - React, Next.js, Vue, and more
- 📱 **Mobile-first** - Optimized for all devices
- 🌟 **AI-powered** - Smart code generation and optimization

## Example Projects

Try asking me to build:
- "Create a todo app with dark mode"
- "Build a landing page for a startup"
- "Make a dashboard with charts"
- "Create a blog with authentication"

Start by telling me what you'd like to build! 🚀`,
  type: "other",
  language: "markdown"
}

export const useCodeHatStore = create<CodeHatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentProject: null,
    files: [], // Initialize with empty files array
    selectedFile: null, // No selected file initially
    
    isPanelOpen: false,
    activeTab: "code",
    previewUrl: null,
    
    // Actions
    setCurrentProject: (project) => set({ currentProject: project }),
    
    setFiles: (files) => set({ 
      files,
      selectedFile: files.length > 0 ? files[0].name : null,
      isPanelOpen: files.length > 1 // Open panel if there are multiple files (more than just README)
    }),
    
    addFile: (file) => set((state) => ({
      files: [...state.files, file],
      selectedFile: file.name,
      isPanelOpen: true // Open panel when adding files
    })),
    
    updateFile: (fileName, content) => set((state) => ({
      files: state.files.map(file => 
        file.name === fileName 
          ? { ...file, content }
          : file
      )
    })),
    
    removeFile: (fileName) => set((state) => {
      const newFiles = state.files.filter(file => file.name !== fileName)
      const newSelectedFile = state.selectedFile === fileName 
        ? (newFiles.length > 0 ? newFiles[0].name : null)
        : state.selectedFile
      
      return {
        files: newFiles,
        selectedFile: newSelectedFile
      }
    }),
    
    setSelectedFile: (fileName) => set({ selectedFile: fileName }),
    
    // UI actions
    togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
    setPanelOpen: (open) => set({ isPanelOpen: open }),
    setIsPanelOpen: (open) => set({ isPanelOpen: open }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setPreviewUrl: (url) => set({ previewUrl: url }),
    
    // Reset
    reset: () => set({
      currentProject: null,
      files: [], // Reset to empty files array
      selectedFile: null, // No selected file after reset
      isPanelOpen: false,
      activeTab: "code",
      previewUrl: null
    })
  }))
)
