import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import config from '../config';
import { useHttpRequest } from '../hooks/http-request';

const Welcome: FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const [name, setName] = useState('');

  const [run, isLoading, response] = useHttpRequest<{ token: string }>(
    new Request(`${config.httpBackendUrl}/token?name=${name}`, {
      method: 'POST',
    }),
  );

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const submitName = useCallback(() => {
    if (name.length >= 1 && name.length <= 32) {
      run();
    }
  }, [name, run]);

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === 'Enter') {
        submitName();
      }
    },
    [submitName],
  );

  useEffect(() => {
    if (response && response.token) {
      setToken(response.token);
    }
  }, [response, setToken]);

  return (
    <>
      Please, enter your name
      <input
        type="text"
        placeholder="from 1 to 32 characters"
        onChange={onInputChange}
        onKeyDown={onEnter}
        value={name}
      />
      <button onClick={submitName} disabled={isLoading}>
        Submit
      </button>
    </>
  );
};

export default Welcome;
