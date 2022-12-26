import { RoomDto } from '../types';
import { FC, useCallback, useContext } from 'react';
import { UserDataContext } from '../contexts/user-data';
import Form from './Form';
import { useWs } from '../hooks/ws';

const RoomsItem: FC<{ room: RoomDto }> = ({ room }) => {
  const { user, token } = useContext(UserDataContext);

  const { send } = useWs(token);

  const join = useCallback(
    ({ password = '' }) => {
      send({
        type: 'JoinRoom',
        payload: { id: room.id, password },
      });
    },
    [send, room.id],
  );

  const leave = useCallback(() => {
    send({
      type: 'LeaveRoom',
      payload: { id: room.id },
    });
  }, [send, room.id]);

  return (
    <>
      <div>{room.name}</div>
      <div>{`${room.player1.name} vs ${room.player2?.name || 'empty'}`}</div>
      {user.id === room.player1.id || user.id === room.player2?.id ? (
        <button onClick={leave}>leave</button>
      ) : (
        <Form
          fields={
            room.hasPassword
              ? {
                  password: {
                    type: 'password',
                    placeholder: 'password',
                    value: '',
                  },
                }
              : {}
          }
          onSubmit={join}
          submitButtonText="join"
        />
      )}
    </>
  );
};

export default RoomsItem;
