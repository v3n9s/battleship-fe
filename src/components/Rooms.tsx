import { FC, useCallback, useContext } from 'react';
import { CreateRoomMessage } from '../types';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';
import { useWs } from '../hooks/ws';
import styled from 'styled-components';

const StyledRooms = styled.div`
  padding: 10px;
`;

const RoomsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 25px;
`;

const StatusText = styled.div`
  text-align: center;
  font-size: 24px;
`;

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
    <StyledRooms>
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
      <RoomsList>
        {!state.serverResponded ? (
          <StatusText>Loading...</StatusText>
        ) : state.rooms.length === 0 ? (
          <StatusText>There is no rooms yet</StatusText>
        ) : (
          state.rooms.map((room) => <RoomsItem key={room.id} room={room} />)
        )}
      </RoomsList>
    </StyledRooms>
  );
};

export default Rooms;
