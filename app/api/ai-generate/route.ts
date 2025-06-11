import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Mock AI-generated code based on the prompt
    const mockCodeResponse = generateMockCode(prompt)

    return NextResponse.json({
      success: true,
      files: mockCodeResponse.files,
      message: mockCodeResponse.message
    })
  } catch (error) {
    console.error('AI Code generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}

function generateMockCode(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
    return {
      message: "Generated a React component with modern styling!",
      files: [
        {
          name: "Button.tsx",
          content: `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200"
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
  }
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}`,
          type: "typescript",
          language: "typescript"
        },
        {
          name: "Button.stories.tsx",
          content: `import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}`,
          type: "typescript",
          language: "typescript"
        }
      ]
    }
  }
  
  if (lowerPrompt.includes('api') || lowerPrompt.includes('backend')) {
    return {
      message: "Generated a Next.js API route with error handling!",
      files: [
        {
          name: "api/users/route.ts",
          content: `import { NextRequest, NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with actual database query
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
    
    return NextResponse.json({ 
      success: true, 
      data: users 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 })
  }
}

// POST /api/users - Create a new user  
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body
    
    if (!name || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name and email are required' 
      }, { status: 400 })
    }
    
    // Mock creation - replace with actual database insertion
    const newUser = { 
      id: Date.now(), 
      name, 
      email 
    }
    
    return NextResponse.json({ 
      success: true, 
      data: newUser 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create user' 
    }, { status: 500 })
  }
}`,
          type: "typescript",
          language: "typescript"
        }
      ]
    }
  }
  
  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return {
      message: "Generated a complete Todo application!",
      files: [
        {
          name: "components/TodoApp.tsx",
          content: `'use client'

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      }])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Todo App
      </h2>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span
                className={\`\${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No todos yet. Add one above!
        </p>
      )}
    </div>
  )
}`,
          type: "typescript",
          language: "typescript"
        },
        {
          name: "app/todo/page.tsx",
          content: `import { TodoApp } from '@/components/TodoApp'

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <TodoApp />
    </div>
  )
}`,
          type: "typescript",
          language: "typescript"
        }
      ]
    }
  }

  // Default response
  return {
    message: "Generated a basic starter file!",
    files: [
      {
        name: "index.tsx",
        content: `export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Project! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Generated by CodeHat AI - Your coding companion
        </p>
        <div className="space-y-4">
          <p className="text-gray-500">
            Request: "${prompt}"
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}`,
        type: "typescript",
        language: "typescript"
      }
    ]
  }
}
