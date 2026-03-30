import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TodoPage from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}