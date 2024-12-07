import { FC, useRef } from 'react';
import { CreateRoomMessage } from '../types';
import Form, { OnSubmitCallback } from './common/Form';
import RoomsItem from './RoomsItem';
import { useWs } from '../hooks/ws';
import styled, { useTheme } from 'styled-components';
import PasswordModal from './PasswordModal';
import { useStore } from '../hooks/store';
import Container from './styled/Container';

const StyledRooms = styled(Container)`
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

  const theme = useTheme();

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
    <StyledRooms maxWidth={theme.mainContainerMaxWidth}>
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
          <StatusText>There are no rooms yet</StatusText>
        ) : (
          state.rooms
            .filter((room) => !room.game)
            .map((room) => <RoomsItem key={room.id} room={room} />)
        )}
      </RoomsList>
    </StyledRooms>
  );
};

export default Rooms;
