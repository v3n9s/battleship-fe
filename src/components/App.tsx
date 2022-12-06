import { FC, useCallback, useState } from 'react';
import { getToken, saveToken } from '../services/token';
import Rooms from './Rooms';
import Welcome from './Welcome';

const App: FC = () => {
  const [token, setToken] = useState(getToken());

  const onToken = useCallback((token: string) => {
    setToken(token);
    saveToken(token);
  }, []);

  return token ? <Rooms token={token} /> : <Welcome setToken={onToken} />;
};

export default App;
