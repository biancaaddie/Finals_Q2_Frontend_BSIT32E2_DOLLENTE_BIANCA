import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";
import { useTodos } from "../hooks/useTodos";

export default function TodoPage() {
  const { warningMessage } = useTodos();

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Todo List</h1>

        {warningMessage && (
          <div className="warning-banner">{warningMessage}</div>
        )}

        <AddTodoForm />
        <TodoList />

        <p className="bonus-note">
          Bonus Mode: Max 5 active tasks, FIFO completion, completed todos
          auto-archive after 15 seconds.
        </p>
      </div>
    </div>
  );
}