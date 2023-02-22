import { createContext } from 'react';

export const RouterContext = createContext(
  null as unknown as { path: string; setRoute: (path: string) => void },
);
