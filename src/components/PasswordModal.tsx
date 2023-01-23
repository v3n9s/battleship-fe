import { FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Form from './Form';
import Modal from './Modal';

const StyledPasswordModal = styled.div`
  margin: 10px auto;
  max-width: 400px;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
`;

const PasswordModal: FC = () => {
  const { dispatch, state } = useStore();

  const { send } = useWs();

  const closeModal = useCallback(() => {
    dispatch({ type: 'ClosePasswordModal' });
  }, [dispatch]);

  const join = useCallback(
    (roomId: string) =>
      ({ password }: { password: string }) => {
        send({
          type: 'JoinRoom',
          payload: { roomId, password },
        });
        closeModal();
      },
    [send, closeModal],
  );

  const formFields = useRef({
    password: {
      type: 'password',
      placeholder: 'password',
      value: '',
    },
  }).current;

  return state.passwordModal.roomId ? (
    <Modal closeModal={closeModal}>
      <StyledPasswordModal>
        <Form
          fields={formFields}
          onSubmit={join(state.passwordModal.roomId)}
          submitButtonText="join"
        />
      </StyledPasswordModal>
    </Modal>
  ) : null;
};

export default PasswordModal;
