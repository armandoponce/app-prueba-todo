import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all todos
export async function GET() {
  try {
    const todos = await db.todo.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST create a new todo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Get the highest order value to place new todo at the end
    const lastTodo = await db.todo.findFirst({
      orderBy: { order: 'desc' }
    })

    const newOrder = (lastTodo?.order || 0) + 1

    const todo = await db.todo.create({
      data: {
        text: text.trim(),
        order: newOrder
      }
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}