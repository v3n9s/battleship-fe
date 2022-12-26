import { FC, useCallback, useContext } from 'react';
import { CreateRoomMessage } from '../types';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';
import { useWs } from '../hooks/ws';

const Rooms: FC = () => {
  const { state, dispatch } = useContext(RoomsContext);

  const { token } = useContext(UserDataContext);

  const { send } = useWs(token, dispatch);

  const createRoom = useCallback(
    (payload: CreateRoomMessage) => {
      send({ type: 'CreateRoom', payload });
    },
    [send],
  );

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
      {!state.serverResponded
        ? 'Loading...'
        : state.rooms.length === 0
        ? 'There is no rooms yet'
        : state.rooms.map((room) => <RoomsItem key={room.id} room={room} />)}
    </>
  );
};

export default Rooms;
