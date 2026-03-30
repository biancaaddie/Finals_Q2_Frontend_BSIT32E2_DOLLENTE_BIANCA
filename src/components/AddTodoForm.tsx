import { useState } from "react";
import { useTodos } from "../hooks/useTodos";

export default function AddTodoForm() {
  const [title, setTitle] = useState("");
  const { addTodo } = useTodos();

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
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}