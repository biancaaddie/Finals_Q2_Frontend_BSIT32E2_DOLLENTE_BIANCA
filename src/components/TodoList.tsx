import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import EditTodoModal from "./EditTodoModal";

export default function TodoList() {
  const { todos, deleteTodo, toggleTodo } = useTodos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span className={todo.completed ? "completed" : ""}>
              {todo.title}
            </span>

            <div className="actions">
              <button
                className="toggle"
                onClick={() => toggleTodo(todo)}
              >
                Toggle
              </button>

              <button
                className="edit"
                onClick={() => {
                  setEditingId(todo.id);
                  setEditingTitle(todo.title);
                }}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId && (
        <EditTodoModal
          id={editingId}
          currentTitle={editingTitle}
          onClose={() => {
            setEditingId(null);
            setEditingTitle("");
          }}
        />
      )}
    </>
  );
}