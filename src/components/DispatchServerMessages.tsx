import { FC } from 'react';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';

const DispatchServerMessages: FC = () => {
  const { state, dispatch } = useStore();

  useWs(state.userData.token, dispatch);

  return null;
};

export default DispatchServerMessages;
