"use client"

import { useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { motion } from 'motion/react'
import '@xterm/xterm/css/xterm.css'

export function CodeHatTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const [isReady, setIsReady] = useState(false)

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
    terminal.writeln('Welcome to CodeHat Terminal! 🎩')
    terminal.writeln('Generated files will appear here...')
    terminal.writeln('')
    terminal.write('$ ')

    // Handle input
    let currentInput = ''
    terminal.onData((data) => {
      if (data === '\r') {
        // Enter key
        terminal.writeln('')
        if (currentInput.trim()) {
          handleCommand(currentInput.trim(), terminal)
        }
        currentInput = ''
        terminal.write('$ ')
      } else if (data === '\u007F') {
        // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (data >= ' ') {
        // Printable characters
        currentInput += data
        terminal.write(data)
      }
    })

    setIsReady(true)

    // Cleanup
    return () => {
      terminal.dispose()
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCommand = (command: string, terminal: Terminal) => {
    switch (command.toLowerCase()) {
      case 'clear':
        terminal.clear()
        break
      case 'ls':
        terminal.writeln('README.md  index.html  styles.css  script.js')
        break
      case 'help':
        terminal.writeln('Available commands:')
        terminal.writeln('  ls       - List files')
        terminal.writeln('  clear    - Clear terminal')
        terminal.writeln('  help     - Show this help')
        terminal.writeln('  npm      - Show npm commands')
        break
      case 'npm':
      case 'npm help':
        terminal.writeln('npm commands:')
        terminal.writeln('  npm install  - Install dependencies')
        terminal.writeln('  npm start    - Start development server')
        terminal.writeln('  npm build    - Build for production')
        break
      case 'npm install':
        terminal.writeln('📦 Installing dependencies...')
        setTimeout(() => {
          terminal.writeln('✅ Dependencies installed successfully!')
        }, 1000)
        break
      case 'npm start':
        terminal.writeln('🚀 Starting development server...')
        setTimeout(() => {
          terminal.writeln('✅ Server running on http://localhost:3000')
        }, 1500)
        break
      case 'npm build':
        terminal.writeln('🔨 Building for production...')
        setTimeout(() => {
          terminal.writeln('✅ Build completed successfully!')
        }, 2000)
        break
      default:
        terminal.writeln(`Command not found: ${command}`)
        terminal.writeln('Type "help" for available commands')
        break
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-[#1a1a1a] overflow-hidden"
    >
      <div
        ref={terminalRef}
        className="h-full w-full p-2"
        style={{ minHeight: '200px' }}
      />
    </motion.div>
  )
}
