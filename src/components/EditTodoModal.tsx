import { useState } from "react";
import { useTodos } from "../hooks/useTodos";

type EditTodoModalProps = {
  id: string;
  currentTitle: string;
  onClose: () => void;
};

export default function EditTodoModal({
  id,
  currentTitle,
  onClose,
}: EditTodoModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const { updateTodo } = useTodos();

  const handleSave = async () => {
    if (!title.trim()) return;
    await updateTodo(id, title);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Todo</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Edit todo..."
        />

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}