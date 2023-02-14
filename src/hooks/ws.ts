import {
  ClientMessage,
  ObjectToUnion,
  ServerMessage,
  ServerMessages,
} from '../types';
import { useContext, useEffect, useRef, useState } from 'react';
import { WsContext } from '../contexts/ws';
import { deepSatisfies } from '../utils';

export type MessageHandler = (m: ServerMessage) => void;

type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Message = ObjectToUnion<{
  [K in keyof ServerMessages]: {
    type: K;
    payload?: ServerMessages[K] extends object
      ? DeepPartial<ServerMessages[K]>
      : undefined;
  };
}>;

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

  const awaitMessage = (m: Message, time = 5000) => {
    return new Promise<void>((res) => {
      const delay = 250;
      const start = Date.now();
      const onResolve = () => {
        setTimeout(() => {
          res();
          removeMessageHandler(awaiter);
        }, Math.max(0, start + delay - Date.now()));
      };
      const awaiter: MessageHandler = (message) => {
        if (deepSatisfies(message, m)) {
          onResolve();
        }
      };
      addMessageHandler(awaiter);
      setTimeout(() => {
        onResolve();
      }, time);
    });
  };

  return {
    send,
    awaitMessage,
    addMessageHandler,
    removeMessageHandler,
    isConnecting,
  };
};
