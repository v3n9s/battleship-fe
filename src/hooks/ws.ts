import { ClientMessage, ServerMessage } from '../types';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsContext } from '../contexts/ws';

export type MessageHandler = (m: ServerMessage) => void;

export const useWs = () => {
  const ws = useContext(WsContext);

  const [isConnecting, setIsConnecting] = useState(
    ws.readyState === ws.CONNECTING,
  );

  const messageHandlers = useRef<MessageHandler[]>([]);

  const addMessageHandler = (handler: MessageHandler) => {
    messageHandlers.current.push(handler);
  };

  const removeMessageHandler = (handler: MessageHandler) => {
    messageHandlers.current = messageHandlers.current.filter(
      (v) => v !== handler,
    );
  };

  useEffect(() => {
    const openHandler = () => {
      setIsConnecting(false);
    };

    const messageHandler = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data as string) as ServerMessage;
        messageHandlers.current.forEach((awaiter) => {
          awaiter(data);
        });
      } catch {}
    };

    if (isConnecting) {
      ws.addEventListener('open', openHandler);
    }
    ws.addEventListener('message', messageHandler);
    return () => {
      ws.removeEventListener('open', openHandler);
      ws.removeEventListener('message', messageHandler);
    };
  }, [ws, isConnecting]);

  const send = (message: ClientMessage) => {
    ws.send(JSON.stringify(message));
  };

  return { send, addMessageHandler, removeMessageHandler, isConnecting };
};
