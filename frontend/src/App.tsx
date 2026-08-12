import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import EntityDetail from "./pages/EntityDetail";
import PathFinder from "./pages/PathFinder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/entity/:type/:id" element={<EntityDetail />} />
        <Route path="/path" element={<PathFinder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
