import { Room } from '../types';
import { FC, useCallback, useContext } from 'react';
import { UserDataContext } from '../contexts/user-data';
import { useWs } from '../hooks/ws';
import { OnPasswordSubmit } from './PasswordModal';

export type SetOnPasswordSubmit = (cb: OnPasswordSubmit) => void;

const RoomsItem: FC<{
  room: Room;
  openModal: SetOnPasswordSubmit;
  closeModal: () => void;
}> = ({ room, openModal, closeModal }) => {
  const { user, token } = useContext(UserDataContext);

  const { send } = useWs(token);

  const joinWithPassword = useCallback<OnPasswordSubmit>(
    ({ password }) => {
      send({
        type: 'JoinRoom',
        payload: { roomId: room.id, password },
      });
      closeModal();
    },
    [send, room.id, closeModal],
  );

  const join = useCallback(() => {
    if (room.hasPassword) {
      openModal(joinWithPassword);
    } else {
      joinWithPassword({ password: '' });
    }
  }, [room.hasPassword, openModal, joinWithPassword]);

  const leave = useCallback(() => {
    send({
      type: 'LeaveRoom',
      payload: { roomId: room.id },
    });
  }, [send, room.id]);

  return (
    <>
      <div>{room.name}</div>
      <div>{`${room.player1.name} vs ${room.player2?.name || 'empty'}`}</div>
      {user.id === room.player1.id || user.id === room.player2?.id ? (
        <button onClick={leave}>leave</button>
      ) : (
        <button onClick={join}>join</button>
      )}
    </>
  );
};

export default RoomsItem;
