import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import LoadingScreen from './components/LoadingScreen';
import AIChatbot from './components/AIChatbot';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#ef4444', fontFamily: 'monospace', background: '#0f172a', minHeight: '100vh' }}>
          <h2>Runtime Error — check console for details</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', opacity: 0.6 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LoadingScreen />
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <CommandPalette />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
