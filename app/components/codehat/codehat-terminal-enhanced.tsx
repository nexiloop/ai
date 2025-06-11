"use client"

import { useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { motion } from 'motion/react'
import { useCodeHatStore } from '@/lib/codehat-store/store'
import '@xterm/xterm/css/xterm.css'

export function CodeHatTerminalEnhanced() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState('/workspaces/agentai')
  const { addFile, updateFile, files } = useCodeHatStore()

  useEffect(() => {
    if (!terminalRef.current) return

    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#ffffff',
        cursor: '#ffffff',
        black: '#000000',
        red: '#ff6b6b',
        green: '#51cf66',
        yellow: '#ffd43b',
        blue: '#339af0',
        magenta: '#f06292',
        cyan: '#22d3ee',
        white: '#ffffff',
        brightBlack: '#666666',
        brightRed: '#ff8a80',
        brightGreen: '#69f0ae',
        brightYellow: '#ffff8d',
        brightBlue: '#448aff',
        brightMagenta: '#ff80ab',
        brightCyan: '#84ffff',
        brightWhite: '#ffffff'
      },
      cols: 80,
      rows: 24
    })

    // Create fit addon
    const fit = new FitAddon()
    terminal.loadAddon(fit)

    // Open terminal
    terminal.open(terminalRef.current)
    
    // Fit terminal to container
    fit.fit()

    // Store references
    terminalInstance.current = terminal
    fitAddon.current = fit

    // Welcome message
    terminal.writeln('🎩 CodeHat Interactive Terminal')
    terminal.writeln('Connected to workspace: /workspaces/agentai')
    terminal.writeln('Type "help" for available commands')
    terminal.writeln('')
    writePrompt(terminal)

    // Handle input
    let currentInput = ''
    let commandHistory: string[] = []
    let historyIndex = -1

    terminal.onData((data) => {
      if (data === '\r') {
        // Enter key
        terminal.writeln('')
        if (currentInput.trim()) {
          commandHistory.unshift(currentInput.trim())
          if (commandHistory.length > 100) commandHistory.pop()
          handleCommand(currentInput.trim(), terminal)
        }
        currentInput = ''
        historyIndex = -1
      } else if (data === '\u007F') {
        // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (data === '\u001b[A') {
        // Up arrow - command history
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++
          const cmd = commandHistory[historyIndex]
          // Clear current input
          for (let i = 0; i < currentInput.length; i++) {
            terminal.write('\b \b')
          }
          // Write command
          currentInput = cmd
          terminal.write(cmd)
        }
      } else if (data === '\u001b[B') {
        // Down arrow - command history
        if (historyIndex > 0) {
          historyIndex--
          const cmd = commandHistory[historyIndex]
          // Clear current input
          for (let i = 0; i < currentInput.length; i++) {
            terminal.write('\b \b')
          }
          // Write command
          currentInput = cmd
          terminal.write(cmd)
        } else if (historyIndex === 0) {
          historyIndex = -1
          // Clear current input
          for (let i = 0; i < currentInput.length; i++) {
            terminal.write('\b \b')
          }
          currentInput = ''
        }
      } else if (data >= ' ' || data === '\t') {
        // Printable characters
        currentInput += data
        terminal.write(data)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (fit) {
        setTimeout(() => fit.fit(), 0)
      }
    }

    window.addEventListener('resize', handleResize)
    setIsReady(true)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  const writePrompt = (terminal: Terminal) => {
    const dir = currentDirectory.replace('/workspaces/agentai', '~')
    terminal.write(`\r\n\x1b[36m$\x1b[0m \x1b[90m${dir}\x1b[0m $ `)
  }

  const handleCommand = async (command: string, terminal: Terminal) => {
    if (command.toLowerCase() === 'help') {
      showHelp(terminal)
      writePrompt(terminal)
      return
    }

    if (command.toLowerCase() === 'clear') {
      terminal.clear()
      terminal.writeln('🎩 CodeHat Interactive Terminal')
      terminal.writeln('Connected to workspace: /workspaces/agentai')
      terminal.writeln('Type "help" for available commands')
      terminal.writeln('')
      writePrompt(terminal)
      return
    }

    if (command.startsWith('cd ')) {
      const newDir = command.substring(3).trim()
      let targetDir = currentDirectory

      if (newDir === '..') {
        const parts = currentDirectory.split('/').filter(Boolean)
        parts.pop()
        targetDir = parts.length > 0 ? '/' + parts.join('/') : '/workspaces/agentai'
      } else if (newDir.startsWith('/')) {
        targetDir = newDir
      } else if (newDir === '~') {
        targetDir = '/workspaces/agentai'
      } else {
        targetDir = currentDirectory + '/' + newDir
        // Normalize the path
        targetDir = targetDir.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
      }

      // Validate directory exists by trying to list it
      try {
        const response = await fetch('/api/terminal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            command: 'ls',
            cwd: targetDir
          })
        })

        const result = await response.json()
        if (result.success) {
          setCurrentDirectory(targetDir)
          terminal.writeln(`\x1b[90m${targetDir}\x1b[0m`)
        } else {
          terminal.writeln(`\x1b[31mcd: ${newDir}: No such file or directory\x1b[0m`)
        }
      } catch (error) {
        terminal.writeln(`\x1b[31mcd: ${newDir}: No such file or directory\x1b[0m`)
      }
      
      writePrompt(terminal)
      return
    }

    if (command === 'pwd') {
      terminal.writeln(currentDirectory)
      writePrompt(terminal)
      return
    }

    // Send command to backend API
    try {
      terminal.write('\r\x1b[33m⚡ Executing...\x1b[0m')
      
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          cwd: currentDirectory
        })
      })

      const result = await response.json()
      
      // Clear the "Executing..." message
      terminal.write('\r\x1b[K')
      
      if (result.clear) {
        terminal.clear()
        writePrompt(terminal)
        return
      }
      
      if (result.output) {
        // Handle colored output and formatting
        const lines = result.output.split('\n')
        lines.forEach((line: string, index: number) => {
          if (line.trim()) {
            terminal.writeln(line)
          } else if (index < lines.length - 1) {
            terminal.writeln('')
          }
        })
      }
      
      // Handle file operations
      if (result.fileName && result.fileContent !== undefined) {
        // File was read, add or update in store
        const existingFile = files.find(f => f.name === result.fileName)
        if (existingFile) {
          updateFile(result.fileName, result.fileContent)
        } else {
          addFile({
            name: result.fileName,
            content: result.fileContent,
            type: getFileType(result.fileName),
            language: getLanguageFromFileName(result.fileName)
          })
        }
        terminal.writeln(`\x1b[32m✓ File loaded into editor: ${result.fileName}\x1b[0m`)
      }
      
      if (!result.success && result.error) {
        terminal.writeln(`\x1b[31mError: ${result.error}\x1b[0m`)
      }
      
    } catch (error) {
      terminal.write('\r\x1b[K')
      terminal.writeln(`\x1b[31mNetwork error: ${error instanceof Error ? error.message : 'Unknown error'}\x1b[0m`)
    }
    
    writePrompt(terminal)
  }

  const showHelp = (terminal: Terminal) => {
    terminal.writeln('')
    terminal.writeln('\x1b[36m🎩 CodeHat Interactive Terminal\x1b[0m')
    terminal.writeln('\x1b[90m═══════════════════════════════════════\x1b[0m')
    terminal.writeln('')
    terminal.writeln('\x1b[33mFile Operations:\x1b[0m')
    terminal.writeln('  \x1b[32mls\x1b[0m [dir]              - List files and directories')
    terminal.writeln('  \x1b[32mcat\x1b[0m <file>            - Display file contents')
    terminal.writeln('  \x1b[32mcreate-file\x1b[0m <name>    - Create a new file')
    terminal.writeln('  \x1b[32medit-file\x1b[0m <name>      - Edit file (loads into editor)')
    terminal.writeln('  \x1b[32msave-file\x1b[0m <name> <content> - Save content to file')
    terminal.writeln('  \x1b[32mmkdir\x1b[0m <dir>           - Create directory')
    terminal.writeln('  \x1b[32mrm\x1b[0m <file>            - Remove file')
    terminal.writeln('  \x1b[32mrmdir\x1b[0m <dir>          - Remove directory')
    terminal.writeln('')
    terminal.writeln('\x1b[33mNavigation:\x1b[0m')
    terminal.writeln('  \x1b[32mpwd\x1b[0m                   - Show current directory')
    terminal.writeln('  \x1b[32mcd\x1b[0m <dir>              - Change directory')
    terminal.writeln('  \x1b[32mcd\x1b[0m ..                - Go up one directory')
    terminal.writeln('  \x1b[32mcd\x1b[0m ~                 - Go to workspace root')
    terminal.writeln('')
    terminal.writeln('\x1b[33mDevelopment:\x1b[0m')
    terminal.writeln('  \x1b[32mnpm install\x1b[0m [package]  - Install npm packages')
    terminal.writeln('  \x1b[32mnpm init\x1b[0m              - Initialize package.json')
    terminal.writeln('  \x1b[32mnpm run\x1b[0m <script>      - Run npm script')
    terminal.writeln('  \x1b[32mnpm start\x1b[0m             - Start development server')
    terminal.writeln('  \x1b[32mnpm run build\x1b[0m         - Build for production')
    terminal.writeln('')
    terminal.writeln('\x1b[33mGit Commands:\x1b[0m')
    terminal.writeln('  \x1b[32mgit init\x1b[0m              - Initialize git repository')
    terminal.writeln('  \x1b[32mgit add\x1b[0m <files>       - Add files to staging')
    terminal.writeln('  \x1b[32mgit commit\x1b[0m -m <msg>   - Commit changes')
    terminal.writeln('  \x1b[32mgit status\x1b[0m            - Show git status')
    terminal.writeln('  \x1b[32mgit log\x1b[0m --oneline     - Show commit history')
    terminal.writeln('')
    terminal.writeln('\x1b[33mSystem:\x1b[0m')
    terminal.writeln('  \x1b[32mclear\x1b[0m                 - Clear terminal')
    terminal.writeln('  \x1b[32mhelp\x1b[0m                  - Show this help message')
    terminal.writeln('')
    terminal.writeln('\x1b[90m💡 All standard shell commands are supported!\x1b[0m')
    terminal.writeln('')
  }

  const getFileType = (fileName: string): "component" | "page" | "style" | "config" | "other" => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const typeMap: { [key: string]: "component" | "page" | "style" | "config" | "other" } = {
      'js': 'component',
      'jsx': 'component',
      'ts': 'component',
      'tsx': 'component',
      'css': 'style',
      'scss': 'style',
      'html': 'page',
      'json': 'config',
      'md': 'other',
      'py': 'other',
      'sh': 'config'
    }
    return typeMap[ext || ''] || 'other'
  }

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'sh': 'bash'
    }
    return languageMap[ext || ''] || 'plaintext'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
    >
      <div className="h-full w-full" ref={terminalRef} />
    </motion.div>
  )
}
