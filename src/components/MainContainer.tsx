import { useState } from 'react';
import { useTheme } from 'styled-components';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import StoreProvider from './providers/StoreProvider';
import Container from './styled/Container';
import Welcome from './Welcome';
import DispatchServerMessages from './DispatchServerMessages';
import WsProvider from './providers/WsProvider';
import Alerts from './Alerts';

const MainContainer = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = (data: UserData) => {
    setUserData(data);
    saveUserData(data);
  };

  const theme = useTheme();

  return (
    <Container maxWidth={theme.mainContainerMaxWidth}>
      {userData ? (
        <StoreProvider userData={userData}>
          <WsProvider>
            <>
              <DispatchServerMessages />
              <Rooms />
              <Alerts />
            </>
          </WsProvider>
        </StoreProvider>
      ) : (
        <Welcome setUserData={onUserData} />
      )}
    </Container>
  );
};

export default MainContainer;
