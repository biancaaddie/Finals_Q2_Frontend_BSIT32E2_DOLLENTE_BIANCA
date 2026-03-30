import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";

export default function TodoPage() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Todo List</h1>
        <AddTodoForm />
        <TodoList />
      </div>
    </div>
  );
}