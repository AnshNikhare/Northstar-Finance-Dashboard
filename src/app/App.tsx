import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FinanceProvider } from '../context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <RouterProvider router={router} />
    </FinanceProvider>
  );
}

export default App;
