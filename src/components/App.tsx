import { FC } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Alerts from './Alerts';
import DispatchServerMessages from './DispatchServerMessages';
import RouterProvider from './providers/RouterProvider';
import StoreProvider from './providers/StoreProvider';
import WsProvider from './providers/WsProvider';
import Routes from './Routes';
import WsLoader from './WsLoader';

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
    <WsProvider>
      <StoreProvider>
        <DispatchServerMessages />
        <ThemeProvider theme={theme}>
          <ResetStyles />
          <WsLoader>
            <Alerts />
            <RouterProvider>
              <Routes />
            </RouterProvider>
          </WsLoader>
        </ThemeProvider>
      </StoreProvider>
    </WsProvider>
  );
};

export default App;
