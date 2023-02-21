import { FC } from 'react';
import Form from './Form';
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
        onSubmit={({ name }) => {
          if (name.length >= 1 && name.length <= 32) {
            send({ type: 'GetToken', payload: { name } });
          }
        }}
        submitButtonText="Submit"
      />
    </StyledWelcome>
  );
};

export default Welcome;
