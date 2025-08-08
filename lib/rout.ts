import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for validating task creation
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255, 'Title too long'),
});

// Schema for validating task updates
const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

// GET /api/tasks - Get all tasks
export async function GET(): Promise<NextResponse> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: tasks 
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tasks' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createTaskSchema.parse(body);
    
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: task 
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    console.error('Error creating task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create task' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/tasks - Update task
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = updateTaskSchema.parse(body);
    
    const task = await prisma.task.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.title !== undefined && { title: validatedData.title }),
        ...(validatedData.completed !== undefined && { completed: validatedData.completed }),
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: task 
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    console.error('Error updating task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update task' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/tasks - Delete task
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task ID is required' 
        },
        { status: 400 }
      );
    }
    
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete task' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}