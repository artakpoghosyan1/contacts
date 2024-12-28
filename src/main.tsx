import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createRouter, Navigate} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import './index.css'

const queryClient = new QueryClient();
const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => <Navigate to='/contacts'/>
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>
    );
}