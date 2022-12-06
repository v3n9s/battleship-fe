import { useEffect, useState } from 'react';

export const useWs = <T>(ws: WebSocket, cb: (data: T) => void) => {
  const [isConnecting, setIsConnecting] = useState(true);

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
      if (data) {
        cb(data as T);
      }
    };
    ws.addEventListener('open', openHandler);
    ws.addEventListener('message', messageHandler);
    return () => {
      ws.removeEventListener('open', openHandler);
      ws.removeEventListener('message', messageHandler);
    };
  }, [ws, cb]);

  return [isConnecting] as const;
};
