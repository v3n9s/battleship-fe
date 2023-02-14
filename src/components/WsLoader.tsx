import { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { useWs } from '../hooks/ws';

const StyledText = styled.div`
  margin: 0px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;

const WsLoader: FC<{ children: ReactElement }> = ({ children }) => {
  const { isConnecting } = useWs();

  return isConnecting ? <StyledText>Loading...</StyledText> : children;
};

export default WsLoader;
