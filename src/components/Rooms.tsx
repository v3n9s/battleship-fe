import { FC, useCallback, useContext, useRef, useState } from 'react';
import { CreateRoomMessage } from '../types';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { UserDataContext } from '../contexts/user-data';
import { RoomsContext } from '../contexts/rooms';
import { useWs } from '../hooks/ws';
import styled from 'styled-components';
import PasswordModal, { OnPasswordSubmit } from './PasswordModal';

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

  const [modal, setModal] = useState<{
    isOpen: boolean;
    onSubmit: OnPasswordSubmit;
  }>({ isOpen: false, onSubmit: () => undefined });

  const openModal = useCallback((cb: OnPasswordSubmit) => {
    setModal({ isOpen: true, onSubmit: cb });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  const { token } = useContext(UserDataContext);

  const { send } = useWs(token, dispatch);

  const createRoom = useCallback(
    (payload: CreateRoomMessage) => {
      send({ type: 'CreateRoom', payload });
    },
    [send],
  );

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
      <PasswordModal
        isOpen={modal.isOpen}
        onSubmit={modal.onSubmit}
        closeModal={closeModal}
      />
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
          state.rooms.map((room) => (
            <RoomsItem
              key={room.id}
              room={room}
              openModal={openModal}
              closeModal={closeModal}
            />
          ))
        )}
      </RoomsList>
    </StyledRooms>
  );
};

export default Rooms;
