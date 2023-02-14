import { FC, useEffect } from 'react';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';

const DispatchServerMessages: FC = () => {
  const { dispatch } = useStore();

  const { addMessageHandler, removeMessageHandler } = useWs();

  useEffect(() => {
    addMessageHandler(dispatch);
    return () => {
      removeMessageHandler(dispatch);
    };
  }, [addMessageHandler, removeMessageHandler, dispatch]);

  return null;
};

export default DispatchServerMessages;
