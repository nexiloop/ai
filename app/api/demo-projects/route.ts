import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'create_react_project':
        return createReactProject()
      case 'create_simple_webpage':
        return createSimpleWebpage()
      case 'create_api_project':
        return createApiProject()
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create demo project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function createReactProject() {
  const files = [
    {
      name: 'App.tsx',
      content: `import React, { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎩 CodeHat React Demo</h1>
        <p>You clicked {count} times</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="counter-button"
        >
          Click me!
        </button>
        <p>
          Edit <code>App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App`,
      language: 'typescript',
      type: 'component'
    },
    {
      name: 'App.css',
      content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

.counter-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.counter-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

code {
  background-color: #f4f4f4;
  color: #333;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: Monaco, monospace;
}`,
      language: 'css',
      type: 'style'
    },
    {
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeHat React Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      language: 'html',
      type: 'page'
    }
  ]

  return NextResponse.json({
    success: true,
    projectName: 'react-demo',
    description: 'A simple React counter application',
    files,
    message: '🚀 Created React demo project! Use terminal: cd codehat-projects/react-demo && npm install && npm run dev'
  })
}

function createSimpleWebpage() {
  const files = [
    {
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎩 CodeHat Demo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎩 Welcome to CodeHat!</h1>
            <p>Your AI-powered coding companion</p>
        </header>
        
        <main>
            <section class="demo-section">
                <h2>Interactive Demo</h2>
                <button id="magic-button" class="magic-btn">✨ Click for Magic!</button>
                <div id="output" class="output"></div>
            </section>
            
            <section class="features">
                <div class="feature">
                    <h3>🚀 Instant Generation</h3>
                    <p>Generate code from natural language descriptions</p>
                </div>
                <div class="feature">
                    <h3>🛠️ Real Terminal</h3>
                    <p>Execute commands and manage files directly</p>
                </div>
                <div class="feature">
                    <h3>👀 Live Preview</h3>
                    <p>See your creations come to life instantly</p>
                </div>
            </section>
        </main>
        
        <footer>
            <p>Generated with ❤️ by CodeHat AI</p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
      language: 'html',
      type: 'page'
    },
    {
      name: 'style.css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 50px;
}

header h1 {
    font-size: 3em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

header p {
    font-size: 1.2em;
    opacity: 0.9;
}

.demo-section {
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    margin-bottom: 40px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

.magic-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    border: none;
    color: white;
    padding: 15px 30px;
    font-size: 1.1em;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
    font-weight: bold;
}

.magic-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.output {
    min-height: 50px;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    margin-top: 20px;
    font-family: 'Courier New', monospace;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.feature {
    background: rgba(255,255,255,0.1);
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    transition: transform 0.3s ease;
}

.feature:hover {
    transform: translateY(-5px);
}

.feature h3 {
    margin-bottom: 15px;
    font-size: 1.3em;
}

footer {
    text-align: center;
    opacity: 0.8;
    margin-top: 40px;
}

@media (max-width: 768px) {
    header h1 {
        font-size: 2em;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
    
    .container {
        padding: 10px;
    }
}`,
      language: 'css',
      type: 'style'
    },
    {
      name: 'script.js',
      content: `document.addEventListener('DOMContentLoaded', function() {
    const magicButton = document.getElementById('magic-button');
    const output = document.getElementById('output');
    
    const magicMessages = [
        "✨ CodeHat is generating amazing code...",
        "🎩 Pulling rabbits out of the digital hat...",
        "🚀 Launching your ideas into reality...",
        "💡 Transforming thoughts into code...",
        "🌟 Making development magic happen...",
        "🔮 Predicting your next awesome project...",
        "⚡ Supercharging your coding workflow...",
        "🎨 Painting with pixels and logic..."
    ];
    
    let clickCount = 0;
    
    magicButton.addEventListener('click', function() {
        clickCount++;
        
        // Add animation
        magicButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            magicButton.style.transform = 'scale(1)';
        }, 150);
        
        // Show magic message
        const randomMessage = magicMessages[Math.floor(Math.random() * magicMessages.length)];
        output.innerHTML = \`
            <div style="animation: fadeIn 0.5s ease-in;">
                <p>\${randomMessage}</p>
                <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                    Magic used: \${clickCount} times 🎭
                </p>
            </div>
        \`;
        
        // Add some sparkle effects
        createSparkles();
    });
    
    function createSparkles() {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.fontSize = '20px';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkle 1s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    }
    
    // Add sparkle animation CSS
    const style = document.createElement('style');
    style.textContent = \`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes sparkle {
            0% { opacity: 1; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
            100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
    \`;
    document.head.appendChild(style);
});`,
      language: 'javascript',
      type: 'other'
    }
  ]

  return NextResponse.json({
    success: true,
    projectName: 'simple-webpage',
    description: 'A beautiful interactive webpage demo',
    files,
    message: '🌐 Created webpage demo! Use terminal: cd codehat-projects/simple-webpage && python -m http.server 8000'
  })
}

function createApiProject() {
  const files = [
    {
      name: 'server.js',
      content: `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' }
];

let posts = [
  { id: 1, title: 'Welcome to CodeHat API', content: 'This is a demo API created by CodeHat!', authorId: 1 },
  { id: 2, title: 'Building APIs is Fun', content: 'With CodeHat, you can generate APIs instantly!', authorId: 2 }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎩 Welcome to CodeHat API Demo!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name and email are required' 
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role
  };
  
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
  const postsWithAuthors = posts.map(post => ({
    ...post,
    author: users.find(u => u.id === post.authorId)
  }));
  res.json({ success: true, data: postsWithAuthors });
});

app.post('/api/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  
  if (!title || !content || !authorId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title, content, and authorId are required' 
    });
  }
  
  const author = users.find(u => u.id === parseInt(authorId));
  if (!author) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid authorId' 
    });
  }
  
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    authorId: parseInt(authorId)
  };
  
  posts.push(newPost);
  res.status(201).json({ success: true, data: { ...newPost, author } });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(\`🚀 CodeHat API Demo server running on port \${PORT}\`);
  console.log(\`📍 Access it at: http://localhost:\${PORT}\`);
});`,
      language: 'javascript',
      type: 'other'
    },
    {
      name: 'package.json',
      content: `{
  "name": "codehat-api-demo",
  "version": "1.0.0",
  "description": "A demo API server generated by CodeHat",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["api", "express", "demo", "codehat"],
  "author": "CodeHat AI",
  "license": "MIT"
}`,
      language: 'json',
      type: 'config'
    }
  ]

  return NextResponse.json({
    success: true,
    projectName: 'api-demo',
    description: 'A REST API server with Express.js',
    files,
    message: '🔧 Created API demo! Use terminal: cd codehat-projects/api-demo && npm install && npm start'
  })
}
