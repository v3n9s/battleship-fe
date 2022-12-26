import { FC, useCallback, useReducer, useState } from 'react';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';
import { roomsReducer } from '../reducers/rooms';

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

  return userData ? (
    <UserDataContext.Provider value={userData}>
      <RoomsContext.Provider value={{ state, dispatch }}>
        <Rooms />
      </RoomsContext.Provider>
    </UserDataContext.Provider>
  ) : (
    <Welcome setUserData={onUserData} />
  );
};

export default App;
