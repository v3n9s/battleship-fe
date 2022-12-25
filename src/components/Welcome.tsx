import { FC, useCallback } from 'react';
import { UserData } from '../types';
import config from '../config';
import Form from './Form';

const Welcome: FC<{
  setUserData: (data: UserData) => void;
}> = ({ setUserData }) => {
  const submitName = useCallback(
    async ({ name }: { name: string }) => {
      if (name.length >= 1 && name.length <= 32) {
        const response = await fetch(
          `${config.httpBackendUrl}/token?name=${name}`,
          {
            method: 'POST',
          },
        );
        const userData = (await response.json()) as UserData;
        setUserData(userData);
      }
    },
    [setUserData],
  );

  return (
    <Form
      fields={{
        name: {
          type: 'text',
          placeholder: 'Please, enter your name',
          value: '',
        },
      }}
      onSubmit={submitName}
      submitButtonText="Submit"
    />
  );
};

export default Welcome;
