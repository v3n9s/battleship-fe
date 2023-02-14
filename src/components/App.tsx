import { FC } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import DispatchServerMessages from './DispatchServerMessages';
import MainContainer from './MainContainer';
import StoreProvider from './providers/StoreProvider';
import WsProvider from './providers/WsProvider';

const ResetStyles = createGlobalStyle`
  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    background: transparent;
    font-family: monospace;
  }

  body {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.secondaryColor};
  }

  button,
  input,
  textarea {
    color: ${(props) => props.theme.secondaryColor};
    border: 0px;
  }

  textarea {
    resize: none;
  }
`;

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ResetStyles />
      <WsProvider>
        <StoreProvider>
          <>
            <DispatchServerMessages />
            <MainContainer />
          </>
        </StoreProvider>
      </WsProvider>
    </ThemeProvider>
  );
};

export default App;
