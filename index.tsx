import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Iniciando Escola Express...");

const container = document.getElementById('root');
const loading = document.getElementById('loading-screen');
const statusMsg = document.getElementById('status-msg');

const hideLoading = () => {
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }
};

if (container) {
  const root = createRoot(container);
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Tenta esconder a tela após um curto delay
    setTimeout(hideLoading, 500);
  } catch (error) {
    console.error("Erro ao renderizar App:", error);
    if (statusMsg) statusMsg.innerText = "Erro de renderização. Verifique o console.";
    hideLoading();
  }
} else {
  console.error("Elemento #root não encontrado.");
}