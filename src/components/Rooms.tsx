import { FC, useRef, useState } from 'react';
import { CreateRoomMessage } from '../types';
import Form, { OnSubmitCallback } from './Form';
import RoomsItem from './RoomsItem';
import { useWs } from '../hooks/ws';
import styled from 'styled-components';
import PasswordModal from './PasswordModal';
import { useStore } from '../hooks/store';
import PositionsModal from './PositionsModal';

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
  const { state } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const { send, awaitMessage } = useWs();

  const createRoom: OnSubmitCallback<CreateRoomMessage> = async (
    payload,
    setValues,
  ) => {
    send({ type: 'CreateRoom', payload });
    setIsLoading(true);
    await Promise.any([
      awaitMessage({
        type: 'RoomCreate',
        payload: { player1: { id: state.userData.id } },
      }),
      awaitMessage({
        type: 'Error',
        payload: { text: 'Message data is wrong' },
      }),
    ]);
    setIsLoading(false);
    setValues({ name: '', password: '' });
  };

  const createRoomFormFields = useRef({
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
  }).current;

  return (
    <StyledRooms>
      <PasswordModal />
      <PositionsModal />
      <Form
        fields={createRoomFormFields}
        onSubmit={createRoom}
        submitButtonText="Create room"
        isLoading={isLoading}
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
