import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BancoApp } from './BancoApp.tsx';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BancoApp />
  </StrictMode>
);
