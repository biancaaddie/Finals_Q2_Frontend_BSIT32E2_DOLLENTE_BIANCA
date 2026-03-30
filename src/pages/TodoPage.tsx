import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";
import { useTodos } from "../hooks/useTodos";

export default function TodoPage() {
  const { chainValid, chainMessage, warningMessage } = useTodos();

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Todo List</h1>

        {!chainValid && (
          <div className="tampered-banner">
            REDACTED / TAMPERED: {chainMessage}
          </div>
        )}

        {chainValid && chainMessage && (
          <div className="valid-banner">
            {chainMessage}
          </div>
        )}

        {warningMessage && (
          <div className="warning-banner">{warningMessage}</div>
        )}

        <AddTodoForm />
        <TodoList />

        <p className="bonus-note">
          Bonus Mode: Max 5 active tasks, FIFO completion, 15-second shadow
          archive, and blockchain verification.
        </p>
      </div>
    </div>
  );
}