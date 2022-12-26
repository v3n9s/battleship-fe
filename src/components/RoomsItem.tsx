import { ClientMessage, RoomDto } from '../types';
import { FC, useCallback, useContext } from 'react';
import { UserDataContext } from '../contexts/user-data';
import Form from './Form';

const RoomsItem: FC<{
  room: RoomDto;
  ws: WebSocket;
}> = ({ room, ws }) => {
  const { user } = useContext(UserDataContext);

  const join = useCallback(
    ({ password = '' }) => {
      ws.send(
        JSON.stringify({
          type: 'JoinRoom',
          payload: { id: room.id, password },
        } satisfies ClientMessage),
      );
    },
    [ws, room.id],
  );

  const leave = useCallback(() => {
    ws.send(
      JSON.stringify({
        type: 'LeaveRoom',
        payload: { id: room.id },
      } satisfies ClientMessage),
    );
  }, [ws, room.id]);

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
