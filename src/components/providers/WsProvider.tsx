import { FC, ReactNode, useEffect, useState } from 'react';
import config from '../../config';
import { WsContext } from '../../contexts/ws';

const WsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<null | WebSocket>(null);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const connection = new WebSocket(config.backendUrl);
    setWs(connection);
    return () => {
      connection.close();
    };
  }, []);

  return (
    ws && (
      <WsContext.Provider value={{ ws, loggedIn, setLoggedIn }}>
        {children}
      </WsContext.Provider>
    )
  );
};

export default WsProvider;
