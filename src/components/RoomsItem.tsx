import { Room } from '../types';
import { FC, useContext } from 'react';
import { useWs } from '../hooks/ws';
import Button from './styled/Button';
import styled from 'styled-components';
import { useStore } from '../hooks/store';
import { UserDataContext } from '../contexts/user-data';
import Link from './common/Link';

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

const RoomsItem: FC<{ room: Room }> = ({ room }) => {
  const { dispatch } = useStore();

  const { userData } = useContext(UserDataContext);

  const { send } = useWs();

  const openPasswordModal = () => {
    dispatch({ type: 'OpenPasswordModal', payload: { roomId: room.id } });
  };

  const join = () => {
    send({
      type: 'JoinRoom',
      payload: { roomId: room.id, password: '' },
    });
  };

  const leave = () => {
    send({
      type: 'LeaveRoom',
      payload: { roomId: room.id },
    });
  };

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
        {(userData.id === room.player1.id ||
          userData.id === room.player2?.id) && (
          <Link borderless to={`rooms/${room.id}`}>
            to game
          </Link>
        )}
        {userData.id === room.player1.id || userData.id === room.player2?.id ? (
          <Button onClick={leave} borderless>
            leave
          </Button>
        ) : (
          !room.player2?.id && (
            <Button
              onClick={room.hasPassword ? openPasswordModal : join}
              borderless
            >
              join
            </Button>
          )
        )}
      </ButtonsList>
    </StyledRoomsItem>
  );
};

export default RoomsItem;
