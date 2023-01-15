import { ClientMessage, ServerMessage } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { getWsConnection } from '../services/ws-connection';

export const useWs = (token: string, cb?: (data: ServerMessage) => void) => {
  const [isConnecting, setIsConnecting] = useState(true);

  const ws = getWsConnection(token);

  useEffect(() => {
    const openHandler = () => {
      setIsConnecting(false);
    };
    const messageHandler = (e: MessageEvent) => {
      let data: unknown;
      try {
        data = JSON.parse(e.data as string);
      } catch {
        data = null;
      }
      if (cb && data) {
        cb(data as ServerMessage);
      }
    };
    ws.addEventListener('open', openHandler);
    ws.addEventListener('message', messageHandler);
    return () => {
      ws.removeEventListener('open', openHandler);
      ws.removeEventListener('message', messageHandler);
    };
  }, [ws, cb]);

  const send = useCallback(
    (message: ClientMessage) => {
      ws.send(JSON.stringify(message));
    },
    [ws],
  );

  return { send, isConnecting };
};
