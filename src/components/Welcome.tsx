import { FC } from 'react';
import Form, { OnSubmitCallback } from './Form';
import styled from 'styled-components';
import { useWs } from '../hooks/ws';

const StyledWelcome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Welcome: FC = () => {
  const { send } = useWs();

  const submitName: OnSubmitCallback<{ name: string }> = ({ name }) => {
    if (name.length >= 1 && name.length <= 32) {
      send({ type: 'GetToken', payload: { name } });
    }
  };

  return (
    <StyledWelcome>
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
    </StyledWelcome>
  );
};

export default Welcome;
