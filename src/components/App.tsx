import { FC, useCallback, useState } from 'react';
import { getToken, saveToken } from '../services/token';
import Welcome from './Welcome';

const App: FC = () => {
  const [token, setToken] = useState(getToken());

  const onToken = useCallback((token: string) => {
    setToken(token);
    saveToken(token);
  }, []);

  return <>{token ? 'You are logged in' : <Welcome setToken={onToken} />}</>;
};

export default App;
