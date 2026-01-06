import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SlotProvider } from './store/SlotContext';
import SlotMachinePage from './pages/SlotMachinePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <SlotProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SlotMachinePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </SlotProvider>
  )
}

export default App
