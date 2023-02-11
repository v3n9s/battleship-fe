import { FC, useRef, useState } from 'react';
import { UserData } from '../types';
import config from '../config';
import Form, { OnSubmitCallback } from './Form';
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
  const [isLoading, setIsLoading] = useState(false);

  const submitName: OnSubmitCallback<{ name: string }> = async ({ name }) => {
    if (name.length >= 1 && name.length <= 32) {
      setIsLoading(true);
      const response = await fetch(
        `${config.httpBackendUrl}/token?name=${name}`,
        {
          method: 'POST',
        },
      );
      const userData = (await response.json()) as UserData;
      setUserData(userData);
    }
  };
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
        isLoading={isLoading}
      />
    </StyledWelcome>
  );
};

export default Welcome;
