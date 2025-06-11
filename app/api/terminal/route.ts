import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const WORKSPACE_ROOT = '/workspaces/agentai'
const CODEHAT_PROJECT_ROOT = path.join(WORKSPACE_ROOT, 'codehat-projects')

// Ensure CodeHat projects directory exists
async function ensureCodeHatProjectDir() {
  try {
    await fs.mkdir(CODEHAT_PROJECT_ROOT, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle empty or malformed requests
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid JSON in request body' 
      }, { status: 400 })
    }

    const { command, cwd = WORKSPACE_ROOT, projectName } = body

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    // Ensure CodeHat projects directory exists
    await ensureCodeHatProjectDir()

    // Determine working directory - if projectName is provided, use project directory
    let workingDir = cwd
    if (projectName) {
      workingDir = path.join(CODEHAT_PROJECT_ROOT, projectName)
      await fs.mkdir(workingDir, { recursive: true })
    }

    // Handle special commands
    if (command.startsWith('create-file ')) {
      return handleCreateFile(command, workingDir)
    }
    
    if (command.startsWith('edit-file ')) {
      return handleEditFile(command, workingDir)
    }
    
    if (command.startsWith('save-file ')) {
      return handleSaveFile(command, workingDir)
    }
    
    if (command === 'ls' || command.startsWith('ls ')) {
      return handleListFiles(command, workingDir)
    }
    
    if (command.startsWith('cat ')) {
      return handleCatFile(command, workingDir)
    }

    if (command.startsWith('mkdir ')) {
      return handleMakeDirectory(command, workingDir)
    }

    if (command.startsWith('rm ') || command.startsWith('rmdir ')) {
      return handleRemove(command, workingDir)
    }

    if (command === 'pwd') {
      return NextResponse.json({
        success: true,
        output: workingDir
      })
    }

    if (command === 'clear') {
      return NextResponse.json({
        success: true,
        output: '',
        clear: true
      })
    }

    if (command === 'help') {
      return NextResponse.json({
        success: true,
        output: `CodeHat Terminal Commands:
  General Commands:
    pwd                    - Show current directory
    ls [path]             - List files and directories
    cat <file>            - Display file contents
    clear                 - Clear terminal
    help                  - Show this help message

  File Operations:
    create-file <name> [content] - Create a new file
    edit-file <name>      - Edit an existing file
    save-file <name> <content>   - Save content to file
    mkdir <directory>     - Create directory
    rm <file>            - Remove file
    rmdir <directory>    - Remove directory

  Package Management:
    npm install [package] - Install npm packages
    npm init             - Initialize package.json
    npm run <script>     - Run npm script

  Git Commands:
    git init             - Initialize git repository
    git add <files>      - Add files to staging
    git commit -m <msg>  - Commit changes
    git status           - Show git status

  All standard shell commands are also supported!`
      })
    }

    // Execute shell command in the working directory
    return executeShellCommand(command, workingDir)
  } catch (error) {
    console.error('Terminal API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}

async function executeShellCommand(command: string, cwd: string): Promise<NextResponse> {
  return new Promise((resolve) => {
    const args = command.split(' ')
    const cmd = args[0]
    const cmdArgs = args.slice(1)
    
    const child = spawn(cmd, cmdArgs, {
      cwd,
      shell: true,
      stdio: 'pipe'
    })
    
    let output = ''
    let errorOutput = ''
    
    child.stdout?.on('data', (data) => {
      output += data.toString()
    })
    
    child.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    child.on('close', (code) => {
      const finalOutput = output || errorOutput || `Command executed with exit code: ${code}`
      resolve(NextResponse.json({
        success: code === 0,
        output: finalOutput,
        exitCode: code
      }))
    })
    
    child.on('error', (error) => {
      resolve(NextResponse.json({
        success: false,
        output: `Error executing command: ${error.message}`,
        error: error.message
      }))
    })
    
    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill()
      resolve(NextResponse.json({
        success: false,
        output: 'Command timed out after 30 seconds',
        error: 'Timeout'
      }))
    }, 30000)
  })
}

async function handleCreateFile(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const fileName = parts[1]
    const content = parts.slice(2).join(' ') || ''
    
    if (!fileName) {
      return NextResponse.json({ 
        success: false, 
        output: 'Usage: create-file <filename> [content]' 
      })
    }
    
    const filePath = path.join(cwd, fileName)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    
    // Create file
    await fs.writeFile(filePath, content)
    
    return NextResponse.json({
      success: true,
      output: `File created: ${fileName}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error creating file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleEditFile(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const fileName = parts[1]
    
    if (!fileName) {
      return NextResponse.json({ 
        success: false, 
        output: 'Usage: edit-file <filename>' 
      })
    }
    
    const filePath = path.join(cwd, fileName)
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({
        success: true,
        output: `Editing ${fileName}:\n${content}`,
        fileContent: content,
        fileName
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        output: `File not found: ${fileName}`
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleSaveFile(command: string, cwd: string): Promise<NextResponse> {
  try {
    const match = command.match(/save-file (\S+) (.+)/)
    if (!match) {
      return NextResponse.json({ 
        success: false, 
        output: 'Usage: save-file <filename> <content>' 
      })
    }
    
    const [, fileName, content] = match
    const filePath = path.join(cwd, fileName)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    
    // Save file
    await fs.writeFile(filePath, content)
    
    return NextResponse.json({
      success: true,
      output: `File saved: ${fileName}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error saving file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleListFiles(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const targetDir = parts[1] || '.'
    const dirPath = path.join(cwd, targetDir)
    
    const files = await fs.readdir(dirPath, { withFileTypes: true })
    const output = files.map(file => {
      const type = file.isDirectory() ? 'd' : '-'
      const name = file.isDirectory() ? `${file.name}/` : file.name
      return `${type} ${name}`
    }).join('\n')
    
    return NextResponse.json({
      success: true,
      output: output || 'Directory is empty'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error listing files: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleCatFile(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const fileName = parts[1]
    
    if (!fileName) {
      return NextResponse.json({ 
        success: false, 
        output: 'Usage: cat <filename>' 
      })
    }
    
    const filePath = path.join(cwd, fileName)
    const content = await fs.readFile(filePath, 'utf-8')
    
    return NextResponse.json({
      success: true,
      output: content
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleMakeDirectory(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const dirName = parts[1]
    
    if (!dirName) {
      return NextResponse.json({ 
        success: false, 
        output: 'Usage: mkdir <directory>' 
      })
    }
    
    const dirPath = path.join(cwd, dirName)
    await fs.mkdir(dirPath, { recursive: true })
    
    return NextResponse.json({
      success: true,
      output: `Directory created: ${dirName}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error creating directory: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

async function handleRemove(command: string, cwd: string): Promise<NextResponse> {
  try {
    const parts = command.split(' ')
    const target = parts[1]
    const isDirectory = command.startsWith('rmdir')
    
    if (!target) {
      return NextResponse.json({ 
        success: false, 
        output: `Usage: ${isDirectory ? 'rmdir' : 'rm'} <${isDirectory ? 'directory' : 'file'}>` 
      })
    }
    
    const targetPath = path.join(cwd, target)
    
    if (isDirectory) {
      await fs.rmdir(targetPath)
      return NextResponse.json({
        success: true,
        output: `Directory removed: ${target}`
      })
    } else {
      await fs.unlink(targetPath)
      return NextResponse.json({
        success: true,
        output: `File removed: ${target}`
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      output: `Error removing ${command.startsWith('rmdir') ? 'directory' : 'file'}: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}
