import { FC, useRef } from 'react';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';

const DispatchServerMessages: FC = () => {
  const { dispatch } = useStore();

  const handlerAdded = useRef(false);

  const { addMessageHandler } = useWs();

  if (!handlerAdded.current) {
    addMessageHandler(dispatch);
    handlerAdded.current = true;
  }

  return null;
};

export default DispatchServerMessages;
