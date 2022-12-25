import { FC, useCallback, useState } from 'react';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/user-data';
import Rooms from './Rooms';
import Welcome from './Welcome';

const App: FC = () => {
  const [userData, setUserData] = useState(getUserData());

  const onUserData = useCallback((data: UserData) => {
    setUserData(data);
    saveUserData(data);
  }, []);

  return userData?.token ? (
    <Rooms token={userData.token} />
  ) : (
    <Welcome setUserData={onUserData} />
  );
};

export default App;
