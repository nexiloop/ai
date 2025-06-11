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
  setActiveTab: (tab: CodeHatPanelTab) => void
  setPreviewUrl: (url: string | null) => void
  
  // Reset
  reset: () => void
}

export const useCodeHatStore = create<CodeHatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentProject: null,
    files: [],
    selectedFile: null,
    
    isPanelOpen: false,
    activeTab: "code",
    previewUrl: null,
    
    // Actions
    setCurrentProject: (project) => set({ currentProject: project }),
    
    setFiles: (files) => set({ 
      files,
      selectedFile: files.length > 0 ? files[0].name : null
    }),
    
    addFile: (file) => set((state) => ({
      files: [...state.files, file],
      selectedFile: file.name
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
    setActiveTab: (tab) => set({ activeTab: tab }),
    setPreviewUrl: (url) => set({ previewUrl: url }),
    
    // Reset
    reset: () => set({
      currentProject: null,
      files: [],
      selectedFile: null,
      isPanelOpen: false,
      activeTab: "code",
      previewUrl: null
    })
  }))
)
