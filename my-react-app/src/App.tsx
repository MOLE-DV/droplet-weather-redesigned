import React from 'react';
import { SettingsProvider } from './contexts/SettingsContext';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <div>
        {/* Your application components will go here */}
      </div>
    </SettingsProvider>
  );
};

export default App;