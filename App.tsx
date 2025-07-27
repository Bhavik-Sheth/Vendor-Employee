import React, { useState, useCallback, useMemo } from 'react';
import { AppMode } from './types';
import { SharedStateProvider } from './context/SharedStateContext';
import HomeScreen from './components/HomeScreen';
import VendorApp from './vendor/VendorApp';
import EmployeeApp from './employee/EmployeeApp';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.Home);

  const handleModeChange = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
  }, []);

  const renderCurrentMode = () => {
    switch (currentMode) {
      case AppMode.Home:
        return <HomeScreen onModeChange={handleModeChange} />;
      case AppMode.Vendor:
        return <VendorApp onBackToHome={() => handleModeChange(AppMode.Home)} />;
      case AppMode.Employee:
        return <EmployeeApp onBackToHome={() => handleModeChange(AppMode.Home)} />;
      default:
        return <HomeScreen onModeChange={handleModeChange} />;
    }
  };

  return (
    <SharedStateProvider>
      <div className="antialiased text-gray-800">
        {renderCurrentMode()}
      </div>
    </SharedStateProvider>
  );
};

export default App;