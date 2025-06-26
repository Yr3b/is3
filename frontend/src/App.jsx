import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QuestionnairePage from "./pages/QuestionnairePage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/cuestionario" element={<QuestionnairePage />} />
        <Route path="/resultados" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;