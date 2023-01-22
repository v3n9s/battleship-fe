import { Room } from '../types';
import { FC, useCallback } from 'react';
import { useWs } from '../hooks/ws';
import Button from './styled/Button';
import styled from 'styled-components';
import { OnPasswordSubmit } from './PasswordModal';
import { useStore } from '../hooks/store';

const StyledRoomsItem = styled.div`
  display: flex;
  border: 2px solid ${(props) => props.theme.primaryColor};
`;

const StyledInfo = styled.div`
  flex: 1 0 100px;
`;

const StyledTitle = styled.div`
  border-bottom: 2px solid ${(props) => props.theme.primaryColor};
  font-size: 32px;
  text-align: center;
  word-break: normal;
  overflow-wrap: anywhere;
`;

const StyledPlayers = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 24px;
`;

const StyledPlayer = styled.div<{ isEmpty?: boolean }>`
  color: ${(props) =>
    props.isEmpty ? props.theme.primaryColor : 'currentcolor'};
  padding: 5px;
  word-break: normal;
  overflow-wrap: anywhere;
`;

const ButtonsList = styled.div`
  display: flex;
  gap: 2px;
  background-color: ${(props) => props.theme.primaryColor};
  border-left: 2px solid ${(props) => props.theme.primaryColor};

  > * {
    min-width: 100px;
  }
`;

export type SetOnPasswordSubmit = (cb: OnPasswordSubmit) => void;

const RoomsItem: FC<{
  room: Room;
  openModal: SetOnPasswordSubmit;
  closeModal: () => void;
}> = ({ room, openModal, closeModal }) => {
  const { state } = useStore();

  const { send } = useWs();

  const joinWithPassword = useCallback<OnPasswordSubmit>(
    ({ password }) => {
      send({
        type: 'JoinRoom',
        payload: { roomId: room.id, password },
      });
      closeModal();
    },
    [send, room.id, closeModal],
  );

  const join = useCallback(() => {
    if (room.hasPassword) {
      openModal(joinWithPassword);
    } else {
      joinWithPassword({ password: '' });
    }
  }, [room.hasPassword, openModal, joinWithPassword]);

  const leave = useCallback(() => {
    send({
      type: 'LeaveRoom',
      payload: { roomId: room.id },
    });
  }, [send, room.id]);

  return (
    <StyledRoomsItem>
      <StyledInfo>
        <StyledTitle>{room.name}</StyledTitle>
        <StyledPlayers>
          <StyledPlayer>{room.player1.name}</StyledPlayer>
          vs
          <StyledPlayer isEmpty={!room.player2?.name}>
            {room.player2?.name || 'empty'}
          </StyledPlayer>
        </StyledPlayers>
      </StyledInfo>
      <ButtonsList>
        {state.userData.user.id === room.player1.id ||
        state.userData.user.id === room.player2?.id ? (
          <Button onClick={leave} borderless>
            leave
          </Button>
        ) : (
          !room.player2?.id && (
            <Button onClick={join} borderless>
              join
            </Button>
          )
        )}
      </ButtonsList>
    </StyledRoomsItem>
  );
};

export default RoomsItem;
