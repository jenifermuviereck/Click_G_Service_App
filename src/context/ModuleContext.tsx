import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppModule = 'service' | 'porter';

interface ModuleContextType {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => Promise<void>;
  toggleModule: () => Promise<void>;
  isPorter: boolean;
  isService: boolean;
  jobTabLabel: string;
  orderTermSingular: string;
  orderTermPlural: string;
}

const MODULE_STORAGE_KEY = '@clickg_active_module';

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<AppModule>('porter');

  useEffect(() => {
    // Load previously selected module, defaulting to 'porter' as seen in active design
    const loadSavedModule = async () => {
      try {
        const saved = await AsyncStorage.getItem(MODULE_STORAGE_KEY);
        if (saved === 'service' || saved === 'porter') {
          setActiveModuleState(saved);
        }
      } catch (e) {
        // Fallback to default
      }
    };
    loadSavedModule();
  }, []);

  const setActiveModule = async (module: AppModule) => {
    setActiveModuleState(module);
    try {
      await AsyncStorage.setItem(MODULE_STORAGE_KEY, module);
    } catch (e) {
      // Error saving
    }
  };

  const toggleModule = async () => {
    const next = activeModule === 'service' ? 'porter' : 'service';
    await setActiveModule(next);
  };

  const isPorter = activeModule === 'porter';
  const isService = activeModule === 'service';

  return (
    <ModuleContext.Provider
      value={{
        activeModule,
        setActiveModule,
        toggleModule,
        isPorter,
        isService,
        jobTabLabel: isPorter ? 'Deliveries' : 'Jobs',
        orderTermSingular: isPorter ? 'Order' : 'Job',
        orderTermPlural: isPorter ? 'Orders' : 'Jobs',
      }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
};

export default ModuleContext;
