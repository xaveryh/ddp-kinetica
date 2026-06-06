import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";
import VisualisationsPage from "./pages/VisualisationsPage";
import PredictionsPage from "./pages/PredictionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ChatPage />} />
          <Route path="visualisations" element={<VisualisationsPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
