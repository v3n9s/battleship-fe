import { FC, ReactElement, useRef } from 'react';
import config from '../config';
import { WsContext } from '../contexts/ws';
import { useStore } from '../hooks/store';

const WsConnection: FC<{ children: ReactElement }> = ({ children }) => {
  const { state } = useStore();

  const ws = useRef<null | WebSocket>(null);

  if (ws.current === null) {
    ws.current = new WebSocket(
      `${config.wsBackendUrl}/?token=${state.userData.token}`,
    );
  }

  return <WsContext.Provider value={ws.current}>{children}</WsContext.Provider>;
};

export default WsConnection;
