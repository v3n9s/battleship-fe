import { FC, useCallback, useState } from 'react';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';
import { UserDataContext } from '../contexts/user-data';

const App: FC = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = useCallback((data: UserData) => {
    setUserData(data);
    saveUserData(data);
  }, []);

  return userData ? (
    <UserDataContext.Provider value={userData}>
      <Rooms />
    </UserDataContext.Provider>
  ) : (
    <Welcome setUserData={onUserData} />
  );
};

export default App;
