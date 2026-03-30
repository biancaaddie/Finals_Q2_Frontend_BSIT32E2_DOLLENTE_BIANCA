import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Todo } from "../types/todo";

type TodoContextType = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
};

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

const API_URL = "http://localhost:5259/api/todos";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), completed: false }),
    });

    const created = await res.json();
    setTodos((prev) => [...prev, created]);
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = async (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed };

    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? updated : t))
    );
  };

  const updateTodo = async (id: string, title: string) => {
    const existing = todos.find((t) => t.id === id);
    if (!existing || !title.trim()) return;

    const updated = {
      ...existing,
      title: title.trim(),
    };

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, deleteTodo, toggleTodo, updateTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}