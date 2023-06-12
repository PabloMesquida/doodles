import React, { createContext, useState, useContext } from "react";

type CanvasContextType = {
  canvas: any;
  setCanvas: React.Dispatch<any> | null;
};

const CanvasContext = createContext<CanvasContextType | null>(null);

type CanvasContextProviderProps = {
  children: React.ReactNode;
};

export const CanvasContextProvider = ({ children }: CanvasContextProviderProps) => {
  const [canvas, setCanvas] = useState<any>(null);

  const contextValue: CanvasContextType = {
    canvas,
    setCanvas: setCanvas,
  };

  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>;
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasContextProvider");
  }

  return context;
};
