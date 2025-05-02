import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ComposedApp } from './composed';
import { shareNetworkState } from './network/share-network-state';
import { preloadChunks } from './preload-chunks';
import './styles/index.css';

shareNetworkState();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ComposedApp />
  </StrictMode>
);

preloadChunks();
