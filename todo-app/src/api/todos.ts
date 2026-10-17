import { apiRequest } from './client';

export type TodoStatus = 'TODO' | 'DONE';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  starred: boolean;
  position: number;
}

export interface UpdateTodoInput {
  title?: string;
  status?: TodoStatus;
  starred?: boolean;
  position?: number;
}

export interface GetTodosParams {
  status?: TodoStatus;
  q?: string;
}

export function getTodos(params?: GetTodosParams): Promise<Todo[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.q) search.set('q', params.q);
  const qs = search.toString();
  return apiRequest<Todo[]>(`/todos${qs ? `?${qs}` : ''}`);
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

export function bulkUpdateTodos(
  ids: number[],
  status: TodoStatus,
): Promise<Todo[]> {
  return apiRequest<Todo[]>('/todos/bulk', {
    method: 'PATCH',
    body: JSON.stringify({ ids, status }),
  });
}

export function reorderTodos(ids: number[]): Promise<Todo[]> {
  return apiRequest<Todo[]>('/todos/order', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return apiRequest<void>(`/todos/${id}`, { method: 'DELETE' });
}
