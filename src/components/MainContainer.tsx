import { useCallback, useState } from 'react';
import { useTheme } from 'styled-components';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Store from './Store';
import Container from './styled/Container';
import Welcome from './Welcome';
import DispatchServerMessages from './DispatchServerMessages';

const MainContainer = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = useCallback((data: UserData) => {
    setUserData(data);
    saveUserData(data);
  }, []);

  const theme = useTheme();

  return (
    <Container maxWidth={theme.mainContainerMaxWidth}>
      {userData ? (
        <Store userData={userData}>
          <>
            <DispatchServerMessages />
            <Rooms />
          </>
        </Store>
      ) : (
        <Welcome setUserData={onUserData} />
      )}
    </Container>
  );
};

export default MainContainer;
