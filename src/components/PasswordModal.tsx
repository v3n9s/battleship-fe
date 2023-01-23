import { FC, useCallback, useRef } from 'react';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Form from './Form';
import Modal from './Modal';

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
    <Modal closeModal={closeModal} maxWidth={400}>
      <Form
        fields={formFields}
        onSubmit={join(state.passwordModal.roomId)}
        submitButtonText="join"
      />
    </Modal>
  ) : null;
};

export default PasswordModal;
