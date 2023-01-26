import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Form from './Form';
import Modal from './Modal';

const PasswordModal: FC = () => {
  const { dispatch, state } = useStore();

  const [isOpen, setIsOpen] = useState(true);

  const { send } = useWs();

  const onModalClose = useCallback(() => {
    dispatch({ type: 'ClosePasswordModal' });
  }, [dispatch]);

  const join = useCallback(
    (roomId: string) =>
      ({ password }: { password: string }) => {
        send({
          type: 'JoinRoom',
          payload: { roomId, password },
        });
        setIsOpen(false);
      },
    [send],
  );

  useEffect(() => {
    if (state.passwordModal.roomId) {
      setIsOpen(true);
    }
  }, [state.passwordModal.roomId]);

  const formFields = useRef({
    password: {
      type: 'password',
      placeholder: 'password',
      value: '',
    },
  }).current;

  return state.passwordModal.roomId ? (
    <Modal onClose={onModalClose} maxWidth={400} isOpen={isOpen}>
      <Form
        fields={formFields}
        onSubmit={join(state.passwordModal.roomId)}
        submitButtonText="join"
      />
    </Modal>
  ) : null;
};

export default PasswordModal;
