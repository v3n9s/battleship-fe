import { FC, useCallback, useRef } from 'react';
import { UserData } from '../types';
import config from '../config';
import Form from './Form';
import styled from 'styled-components';

const StyledWelcome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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
    <StyledWelcome>
      <Form
        fields={
          useRef({
            name: {
              type: 'text',
              placeholder: 'Please, enter your name',
              value: '',
            },
          }).current
        }
        onSubmit={submitName}
        submitButtonText="Submit"
      />
    </StyledWelcome>
  );
};

export default Welcome;
