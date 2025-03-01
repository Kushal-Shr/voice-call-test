import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import JitsiCall from "./JitsiCall";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/call" element={<JitsiCall />} />
      </Routes>
    </Router>
  );
}

export default App;
