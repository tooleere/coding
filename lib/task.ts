export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTaskInput {
    title: string;
  }
  
  export interface UpdateTaskInput {
    id: string;
    completed?: boolean;
    title?: string;
  }