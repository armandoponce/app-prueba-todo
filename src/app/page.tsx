'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Plus } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      })
      if (response.ok) {
        const todo = await response.json()
        setTodos([...todos, todo])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })
      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-center pt-12 pb-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-300 transform rotate-45"></div>
          <div className="w-3 h-3 bg-amber-400 transform rotate-45"></div>
          <h1 className="text-6xl font-bold tracking-wider text-foreground mx-4">
            TODO
          </h1>
          <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* Add Todo Section */}
        <Card className="border-2 border-border">
          <CardContent className="pt-6">
            <form onSubmit={addTodo} className="flex gap-4">
              <Input
                type="text"
                placeholder="Add a to-do item..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 text-lg py-6 px-4 border-border"
              />
              <Button 
                type="submit" 
                className="px-8 py-6 bg-pink-200 text-pink-800 hover:bg-pink-300 font-semibold"
                disabled={!newTodo.trim()}
              >
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Todo List */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                Act Now, Simplify Life <span className="text-2xl">🍒</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading todos...
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center space-y-4 py-8">
                  <h3 className="text-xl font-medium text-muted-foreground">
                    Add Your First To-Do Item! <span className="text-xl">🚀</span>
                  </h3>
                  
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-yellow-500">💡</span> Usage Tips:
                    </h4>
                    
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>Press Enter to submit actions.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>Drag to reorder your to-dos (PC only)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>Double-click to edit slogan and tasks.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>Access quick actions in the right sidebar.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-500">⚠️</span>
                        <span>Your data is stored locally in your browser.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">📊</span>
                        <span>Supports data download and import.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id, !todo.completed)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          todo.completed 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted-foreground hover:border-primary'
                        }`}
                      >
                        {todo.completed && <Check className="w-3 h-3" />}
                      </button>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <Card className="border-2 border-border">
            <CardContent className="pt-6 space-y-4">
              <Button className="w-full bg-emerald-300 text-emerald-800 hover:bg-emerald-400 font-semibold py-6">
                OPEN <span className="ml-2">🔥</span>
              </Button>
              
              <Button className="w-full bg-pink-200 text-pink-800 hover:bg-pink-300 font-semibold py-4">
                All
              </Button>
              
              <Button variant="outline" className="w-full font-medium py-4">
                Import(txt/json)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}