import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Todo } from "../types/todo";

type TodoContextType = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
  verifyChain: () => Promise<void>;
  chainValid: boolean;
  chainMessage: string;
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
  const [chainValid, setChainValid] = useState(true);
  const [chainMessage, setChainMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const activeCount = todos.filter((t) => !t.completed).length;
  const canAddMore = activeCount < MAX_ACTIVE_TASKS;

  const verifyChain = async () => {
    try {
      const res = await fetch(`${API_URL}/verify`);

      if (res.ok) {
        const data = await res.json();
        setChainValid(true);
        setChainMessage(data.message ?? "Chain valid");
      } else {
        const data = await res.json();
        setChainValid(false);
        setChainMessage(data.message ?? "Chain tampered");
      }
    } catch {
      setChainValid(false);
      setChainMessage("Unable to verify blockchain state.");
    }
  };

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const refreshAll = async () => {
    await fetchTodos();
    await verifyChain();
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) return;

    if (!canAddMore) {
      setWarningMessage("Maximum of 5 active tasks reached.");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), completed: false }),
    });

    setWarningMessage("");
    await refreshAll();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await refreshAll();
  };

  const toggleTodo = async (todo: Todo) => {
    if (!todo.completed) {
      const firstIncomplete = todos.find((t) => !t.completed);

      if (firstIncomplete && firstIncomplete.id !== todo.id) {
        setWarningMessage("Tasks must be completed in creation order (FIFO).");
        return;
      }
    }

    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    });

    setWarningMessage("");
    await refreshAll();

    if (!todo.completed) {
      window.setTimeout(async () => {
        try {
          await fetch(`${API_URL}/${todo.id}`, {
            method: "DELETE",
          });
          await refreshAll();
        } catch (error) {
          console.error("Failed to archive completed todo:", error);
        }
      }, SHADOW_ARCHIVE_DELAY);
    }
  };

  const updateTodo = async (id: string, title: string) => {
    const existing = todos.find((t) => t.id === id);
    if (!existing || !title.trim()) return;

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...existing,
        title: title.trim(),
      }),
    });

    await refreshAll();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodo,
        verifyChain,
        chainValid,
        chainMessage,
        activeCount,
        canAddMore,
        warningMessage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}