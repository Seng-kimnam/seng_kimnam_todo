import { apiRequest } from './client';

export type TodoStatus = 'TODO' | 'DONE';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
}

export interface UpdateTodoInput {
  title?: string;
  status?: TodoStatus;
}

export function getTodos(): Promise<Todo[]> {
  return apiRequest<Todo[]>('/todos');
}

export function createTodo(title: string): Promise<Todo> {
  return apiRequest<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export function updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return apiRequest<void>(`/todos/${id}`, { method: 'DELETE' });
}
