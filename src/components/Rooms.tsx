import { FC, useCallback, useContext, useRef } from 'react';
import { ClientMessage, CreateRoomMessage, ServerMessage } from '../types';
import { useWs } from '../hooks/ws';
import { getWsConnection } from '../services/ws-connection';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';

const Rooms: FC = () => {
  const { state, dispatch } = useContext(RoomsContext);

  const { token } = useContext(UserDataContext);

  const ws = useRef(getWsConnection(token));

  const [isConnecting] = useWs<ServerMessage>(ws.current, dispatch);

  const createRoom = useCallback((payload: CreateRoomMessage) => {
    ws.current.send(
      JSON.stringify({ type: 'CreateRoom', payload } satisfies ClientMessage),
    );
  }, []);

  return (
    <>
      <Form
        fields={{
          name: {
            type: 'text',
            placeholder: 'Name',
            value: '',
          },
          password: {
            type: 'password',
            placeholder: 'Password',
            value: '',
          },
        }}
        onSubmit={createRoom}
        submitButtonText="Create room"
      />
      {isConnecting || !state.serverResponded
        ? 'Loading...'
        : state.rooms.length === 0
        ? 'There is no rooms yet'
        : state.rooms.map((room) => (
            <RoomsItem key={room.id} room={room} ws={ws.current} />
          ))}
    </>
  );
};

export default Rooms;
