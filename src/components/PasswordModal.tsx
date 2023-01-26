import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../hooks/store';
import { MessageHandler, useWs } from '../hooks/ws';
import { deepSatisfies } from '../utils';
import Form, { OnSubmitCallback } from './Form';
import Modal from './Modal';

const PasswordModal: FC = () => {
  const { dispatch, state } = useStore();

  const [isOpen, setIsOpen] = useState(true);

  const { send, addMessageHandler, removeMessageHandler } = useWs();

  const onModalClose = useCallback(() => {
    dispatch({ type: 'ClosePasswordModal' });
  }, [dispatch]);

  const join = useCallback(
    (roomId: string) =>
      (({ password }, setValues) => {
        send({
          type: 'JoinRoom',
          payload: { roomId, password },
        });
        const handler: MessageHandler = (message) => {
          removeMessageHandler(handler);
          if (
            deepSatisfies(message, {
              type: 'RoomJoin',
              payload: {
                roomId,
                user: {
                  id: state.userData.id,
                },
              },
            })
          ) {
            setIsOpen(false);
          } else {
            setValues({
              password: '',
            });
          }
        };
        addMessageHandler(handler);
      }) satisfies OnSubmitCallback<{ password: string }>,
    [send, addMessageHandler, removeMessageHandler, state.userData.id],
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
