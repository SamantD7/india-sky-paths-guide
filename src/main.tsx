
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMockAPI } from './api/mocks'

// Initialize mock API
setupMockAPI();

createRoot(document.getElementById("root")!).render(<App />);
