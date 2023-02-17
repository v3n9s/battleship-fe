import { FC, useRef } from 'react';
import { CreateRoomMessage } from '../types';
import Form, { OnSubmitCallback } from './Form';
import RoomsItem from './RoomsItem';
import { useWs } from '../hooks/ws';
import styled from 'styled-components';
import PasswordModal from './PasswordModal';
import { useStore } from '../hooks/store';

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

  const { send } = useWs();

  const createRoom: OnSubmitCallback<CreateRoomMessage> = (
    payload,
    setValues,
  ) => {
    send({ type: 'CreateRoom', payload });
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
      <Form
        fields={createRoomFormFields}
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
