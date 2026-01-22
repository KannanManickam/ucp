import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UcpProvider } from './context/UcpContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { BomUploadPage } from './pages/BomUploadPage';
import { LogViewer } from './components/LogViewer';
import { SuppliersPage } from './pages/SuppliersPage';
import { ResultsPage } from './pages/ResultsPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

function App() {
    return (
        <UcpProvider>
            <Router>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-blue-500/30">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/upload" element={<BomUploadPage />} />
                            <Route path="/suppliers" element={<SuppliersPage />} />
                            <Route path="/results" element={<ResultsPage />} />
                            <Route path="/success" element={<OrderSuccessPage />} />
                            <Route path="*" element={<div className="p-20 text-center">Page Not Found</div>} />
                        </Routes>
                    </main>
                    {/* Global Log Reader (Hidden on Upload page where it is embedded) */}
                    <GlobalLogViewer />
                </div>
            </Router>
        </UcpProvider>
    );
}

function GlobalLogViewer() {
    const location = useLocation();
    // Hide on upload, results, and success pages since they have embedded viewers
    if (location.pathname === '/upload' || location.pathname === '/results' || location.pathname === '/success') return null;
    return <LogViewer />;
}

export default App;
