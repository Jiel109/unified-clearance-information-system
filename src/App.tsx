import React from 'react';
import { AuthGate } from './components/AuthGate';

// Root entry point
export const App: React.FC = () => {
  return <AuthGate />;
};

export default App;