import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Todo } from "../types/todo";

type TodoContextType = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
  activeCount: number;
  canAddMore: boolean;
  warningMessage: string;
};

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

const API_URL = "http://localhost:5259/api/todos";
const MAX_ACTIVE_TASKS = 5;
const SHADOW_ARCHIVE_DELAY = 15000;

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [warningMessage, setWarningMessage] = useState("");

  const activeCount = todos.filter((t) => !t.completed).length;
  const canAddMore = activeCount < MAX_ACTIVE_TASKS;

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) return;

    if (!canAddMore) {
      setWarningMessage("Maximum of 5 active tasks reached.");
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        completed: false,
      }),
    });

    const created = await res.json();
    setTodos((prev) => [...prev, created]);
    setWarningMessage("");
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = async (todo: Todo) => {
    if (!todo.completed) {
      const firstIncomplete = todos.find((t) => !t.completed);

      if (firstIncomplete && firstIncomplete.id !== todo.id) {
        setWarningMessage("Tasks must be completed in creation order (FIFO).");
        return;
      }
    }

    const updated = { ...todo, completed: !todo.completed };

    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? updated : t))
    );

    setWarningMessage("");

    if (!todo.completed) {
      window.setTimeout(async () => {
        try {
          await fetch(`${API_URL}/${todo.id}`, {
            method: "DELETE",
          });

          setTodos((prev) => prev.filter((t) => t.id !== todo.id));
        } catch (error) {
          console.error("Failed to archive completed todo:", error);
        }
      }, SHADOW_ARCHIVE_DELAY);
    }
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
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodo,
        activeCount,
        canAddMore,
        warningMessage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}