import { FC, useCallback, useReducer, useState } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';
import { roomsReducer } from '../reducers/rooms';
import { theme } from '../theme';
import Container from './styled/Container';

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
  const [userData, setUserData] = useState(getUserData());

  const [state, dispatch] = useReducer(roomsReducer, {
    rooms: [],
    serverResponded: false,
  });

  const onUserData = useCallback((data: UserData) => {
    setUserData(data);
    saveUserData(data);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ResetStyles />
      <Container maxWidth={theme.mainContainerMaxWidth}>
        {userData ? (
          <UserDataContext.Provider value={userData}>
            <RoomsContext.Provider value={{ state, dispatch }}>
              <Rooms />
            </RoomsContext.Provider>
          </UserDataContext.Provider>
        ) : (
          <Welcome setUserData={onUserData} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
