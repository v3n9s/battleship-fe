import { FC, useCallback, useRef, useState } from 'react';
import { CreateRoomMessage } from '../types';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { useWs } from '../hooks/ws';
import styled from 'styled-components';
import PasswordModal, { OnPasswordSubmit } from './PasswordModal';
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

  const { state } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const { send, awaitMessage } = useWs();

  const createRoom = useCallback(
    async (payload: CreateRoomMessage) => {
      send({ type: 'CreateRoom', payload });
      setIsLoading(true);
      await Promise.any([
        awaitMessage({
          type: 'RoomCreate',
          payload: { player1: { id: state.userData.user.id } },
        }),
        awaitMessage({
          type: 'Error',
          payload: { text: 'Message data is wrong' },
        }),
      ]);
      setIsLoading(false);
    },
    [send, awaitMessage, state.userData.user.id],
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
        isLoading={isLoading}
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
