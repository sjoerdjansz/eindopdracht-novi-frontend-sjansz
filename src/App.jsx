// CSS
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes.jsx";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
