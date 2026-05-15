import { createContext, useContext } from 'react';

interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
  needsCollapse: boolean;
  peekHeight: number;
  contentRef: React.RefObject<HTMLDivElement>;
}

export const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

export const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsibleContext must be used within a CollapsibleProvider');
  }
  return context;
};
