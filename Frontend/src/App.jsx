import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BillOfMaterials from './pages/BillOfMaterials';
import BomDetail from './pages/BomDetail';
import EcoList from './pages/EcoList';
import CreateEco from './pages/CreateEco';
import EcoDetail from './pages/EcoDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/bom" element={<BillOfMaterials />} />
          <Route path="/bom/:id" element={<BomDetail />} />
          <Route path="/eco" element={<EcoList />} />
          <Route path="/eco/create" element={<CreateEco />} />
          <Route path="/eco/:id" element={<EcoDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-surface-50 flex flex-col md:block">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="md:ml-[256px] transition-all duration-300 flex-1 flex flex-col">
        <Topbar setMobileMenuOpen={setMobileMenuOpen} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <AnimatedRoutes />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </Router>
  );
}
