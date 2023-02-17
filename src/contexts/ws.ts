import { createContext, Dispatch, SetStateAction } from 'react';

export const WsContext = createContext(
  null as unknown as {
    ws: WebSocket;
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
  },
);
