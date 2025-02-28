import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import wasmInit from 'wasm-zeroize';
import { ZeroizedString, ZeroizedStringType } from '../lib/zeroized-string';

// Export the types from the zeroize-module
export type { ZeroizedStringType };

// Define the context type
interface ZeroizeContextType {
  initialized: boolean;
  createZeroizedString: (value: string) => ZeroizedString;
}

// Create the context with default values
const ZeroizeContext = createContext<ZeroizeContextType>({
  initialized: false,
  createZeroizedString: () => {
    throw new Error('Zeroize module not initialized');
  },
});

// Props for the provider component
interface ZeroizeProviderProps {
  children: ReactNode;
}

// Provider component
export const ZeroizeProvider: React.FC<ZeroizeProviderProps> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initModule = async () => {
      try {
        // Initialize the WASM module
        await wasmInit();
        setInitialized(true);
        console.log('Zeroize module initialized successfully');
      } catch (error) {
        console.error('Failed to initialize zeroize module:', error);
        // Don't throw the error, just log it and continue with degraded functionality
      }
    };

    initModule();
  }, []);

  const createZeroizedString = (value: string): ZeroizedString => {
    return new ZeroizedString(value);
  };

  const contextValue: ZeroizeContextType = {
    initialized,
    createZeroizedString,
  };

  return (
    <ZeroizeContext.Provider value={contextValue}>
      {children}
    </ZeroizeContext.Provider>
  );
};

// Custom hook for using the context
export const useZeroize = () => {
  const context = useContext(ZeroizeContext);
  if (context === undefined) {
    throw new Error('useZeroize must be used within a ZeroizeProvider');
  }
  return context;
};
