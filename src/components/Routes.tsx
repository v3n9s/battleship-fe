import { UserData } from '../types';
import { FC, useEffect, useState } from 'react';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';
import { MessageHandler, useWs } from '../hooks/ws';
import { UserDataContext } from '../contexts/user-data';

const Routes: FC = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = (data: UserData | null) => {
    setUserData(data);
    saveUserData(data);
  };

  const { send, addMessageHandler, removeMessageHandler } = useWs();

  useEffect(() => {
    const handler: MessageHandler = (message) => {
      if (message.type === 'TokenCreate') {
        onUserData(message.payload);
      }
    };
    addMessageHandler(handler);
    return () => {
      removeMessageHandler(handler);
    };
  }, [addMessageHandler, removeMessageHandler]);

  useEffect(() => {
    if (userData) {
      send({
        type: 'SubmitToken',
        payload: { token: userData.token },
      });
    }
  }, [send, userData]);

  return userData ? (
    <UserDataContext.Provider value={{ userData }}>
      <Rooms />
    </UserDataContext.Provider>
  ) : (
    <Welcome />
  );
};

export default Routes;
