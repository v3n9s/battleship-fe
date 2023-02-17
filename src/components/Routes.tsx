import { UserData } from '../types';
import { FC, useEffect, useState } from 'react';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';
import { MessageHandler, useWs } from '../hooks/ws';
import { UserDataContext } from '../contexts/user-data';
import { useStore } from '../hooks/store';
import RoomPage from './RoomPage';

const Routes: FC = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = (data: UserData | null) => {
    setUserData(data);
    saveUserData(data);
  };

  const { state } = useStore();

  const {
    send,
    addMessageHandler,
    removeMessageHandler,
    loggedIn,
    setLoggedIn,
  } = useWs();

  useEffect(() => {
    const handler: MessageHandler = (message) => {
      if (message.type === 'TokenCreate') {
        onUserData(message.payload);
      } else if (message.type === 'TokenSet') {
        onUserData(message.payload);
        setLoggedIn(!!message.payload);
      }
    };
    addMessageHandler(handler);
    return () => {
      removeMessageHandler(handler);
    };
  }, [addMessageHandler, removeMessageHandler, setLoggedIn]);

  useEffect(() => {
    if (!loggedIn && userData) {
      send({
        type: 'SubmitToken',
        payload: { token: userData.token },
      });
    }
  }, [loggedIn, send, userData]);

  return userData ? (
    <UserDataContext.Provider value={{ userData }}>
      {state.roomPageId ? <RoomPage roomId={state.roomPageId} /> : <Rooms />}
    </UserDataContext.Provider>
  ) : (
    <Welcome />
  );
};

export default Routes;
