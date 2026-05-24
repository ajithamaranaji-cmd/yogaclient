import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { doc, getDocFromCache } from 'firebase/firestore';
import { db } from './lib/firebase';

async function testConnection() {
  try {
    // Basic connectivity check
    await getDocFromCache(doc(db, 'system', 'ping'));
  } catch (error) {
    console.debug("Offline or initial boot:", error);
  }
}
testConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
