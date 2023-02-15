import { FC, useContext, useEffect, useRef, useState } from 'react';
import { UserDataContext } from '../contexts/user-data';
import { useStore } from '../hooks/store';
import { MessageHandler, useWs } from '../hooks/ws';
import { deepSatisfies } from '../utils';
import Form, { OnSubmitCallback } from './Form';
import Modal from './Modal';

const PasswordModal: FC = () => {
  const { dispatch, state } = useStore();

  const { userData } = useContext(UserDataContext);

  const [isOpen, setIsOpen] = useState(true);

  const { send, addMessageHandler, removeMessageHandler } = useWs();

  const onModalClose = () => {
    dispatch({ type: 'ClosePasswordModal' });
    setIsOpen(true);
  };

  const join = (roomId: string) =>
    (({ password }, setValues) => {
      send({
        type: 'JoinRoom',
        payload: { roomId, password },
      });
      const handler: MessageHandler = (message) => {
        if (
          deepSatisfies(message, {
            type: 'RoomJoin',
            payload: {
              roomId,
              user: {
                id: userData.id,
              },
            },
          })
        ) {
          removeMessageHandler(handler);
          setIsOpen(false);
        } else if (
          deepSatisfies(message, {
            type: 'Error',
            payload: { text: 'Wrong room password' },
          })
        ) {
          removeMessageHandler(handler);
          setValues({
            password: '',
          });
        }
      };
      addMessageHandler(handler);
    }) satisfies OnSubmitCallback<{ password: string }>;

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
