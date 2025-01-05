import { useAuthStore } from '@/store/useAuthStore';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';
import './index.css';
import { router } from './router';

if (!useAuthStore.getState().isAuthenticated) {
  router.navigate('/login');
}

// Initialize socket connection if user is authenticated
// if (useAuthStore.getState().isAuthenticated) {
//   socketService.connect(useAuthStore.getState().currentUser?.id || '');
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SWRConfig>
    <RouterProvider router={router} />
  </SWRConfig>
);
