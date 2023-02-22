import { FC, ReactNode } from 'react';
import { useWs } from '../hooks/ws';
import CenteredContainer from './styled/CenteredContainer';

const WsLoader: FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnecting } = useWs();

  return (
    <>
      {isConnecting ? (
        <CenteredContainer>Connecting...</CenteredContainer>
      ) : (
        children
      )}
    </>
  );
};

export default WsLoader;
