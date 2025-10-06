import React from 'react';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen items-center justify-center text-2xl font-bold text-blue-600">
        안녕하세요
      </div>
    </QueryClientProvider>
  );
}

export default App;
