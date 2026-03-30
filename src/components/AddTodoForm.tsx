import { useState } from "react";
import { useTodos } from "../hooks/useTodos";

export default function AddTodoForm() {
  const [title, setTitle] = useState("");
  const { addTodo, canAddMore, activeCount } = useTodos();

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTodo(title);
    setTitle("");
  };

  return (
    <div className="input-group">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo..."
        disabled={!canAddMore}
      />
      <button onClick={handleAdd} disabled={!canAddMore}>
        Add
      </button>
      <span className="task-counter">{activeCount}/5 active</span>
    </div>
  );
}