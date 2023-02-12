import { FC, ReactElement, useEffect, useState } from 'react';
import config from '../../config';
import { WsContext } from '../../contexts/ws';
import { useStore } from '../../hooks/store';

const WsProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const { state } = useStore();

  const [ws, setWs] = useState<null | WebSocket>(null);

  useEffect(() => {
    const connection = new WebSocket(
      `${config.wsBackendUrl}/?token=${state.userData.token}`,
    );
    setWs(connection);
    return () => {
      connection.close();
    };
  }, [state.userData.token]);

  return ws && <WsContext.Provider value={ws}>{children}</WsContext.Provider>;
};

export default WsProvider;
