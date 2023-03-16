import { UserData } from '../types';
import { FC, useContext, useEffect, useState } from 'react';
import { getUserData, saveUserData } from '../services/user-data';
import RoomsPage from './RoomsPage';
import WelcomePage from './WelcomePage';
import { MessageHandler, useWs } from '../hooks/ws';
import { UserDataContext } from '../contexts/user-data';
import RoomPage from './RoomPage';
import NotFound from './common/NotFound';
import { useRouter } from '../hooks/router';
import { RouterContext } from '../contexts/router';

const Routes: FC = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = (data: UserData | null) => {
    setUserData(data);
    saveUserData(data);
  };

  const {
    send,
    addMessageHandler,
    removeMessageHandler,
    loggedIn,
    setLoggedIn,
  } = useWs();

  const { setRoute } = useContext(RouterContext);

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

  return useRouter([
    {
      path: '',
      getNode: () => {
        setRoute(userData ? 'rooms' : 'welcome');
        return null;
      },
    },
    {
      path: 'welcome',
      getNode: () => {
        if (userData) {
          setRoute('rooms');
        }
        return <WelcomePage />;
      },
    },
    {
      path: 'rooms',
      getNode: () => {
        if (!userData) {
          setRoute('welcome');
          return null;
        }
        return (
          <UserDataContext.Provider value={{ userData }}>
            <RoomsPage />
          </UserDataContext.Provider>
        );
      },
      children: [
        {
          path: '*',
          getNode: (roomId) => {
            if (!userData) {
              setRoute('welcome');
              return null;
            }
            return (
              <UserDataContext.Provider value={{ userData }}>
                <RoomPage roomId={roomId} />
              </UserDataContext.Provider>
            );
          },
        },
      ],
    },
    {
      path: '*',
      getNode: () => <NotFound />,
    },
  ]);
};

export default Routes;
