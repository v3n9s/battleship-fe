import { FC, useContext, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { UserDataContext } from '../contexts/user-data';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Link from './common/Link';
import NotFound from './common/NotFound';
import Positions from './common/Positions';
import Button from './styled/Button';
import Container from './styled/Container';

const StyledRoomPage = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const ButtonsRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
`;

const ExtendedButton = styled(Button)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  text-align: center;
`;

const RoomPage: FC<{ roomId: string }> = ({ roomId }) => {
  const { dispatch, state } = useStore();

  const { userData } = useContext(UserDataContext);

  const { send } = useWs();

  const theme = useTheme();

  const room = state.rooms.find((room) => room.id === roomId);

  const positions = room?.positions;

  useEffect(() => {
    if (room && !positions) {
      dispatch({
        type: 'ResetPositions',
        payload: { roomId },
      });
    }
  }, [room, dispatch, positions, roomId]);

  if (!room || !positions) {
    return <NotFound />;
  }

  const isRoomOwner = userData.id === room.player1.id;

  const isPlayerReady = isRoomOwner
    ? room.player1.hasPositions
    : !!room.player2?.hasPositions;

  const isOpponentReady = !isRoomOwner
    ? room.player1.hasPositions
    : !!room.player2?.hasPositions;

  const random = () => {
    dispatch({
      type: 'SetRandomPositions',
      payload: { roomId },
    });
  };

  const reset = () => {
    dispatch({
      type: 'ResetPositions',
      payload: { roomId },
    });
  };

  const onCheck = (cellInd: [number, number]) => {
    dispatch({
      type: 'SetCell',
      payload: { roomId, field: 'positions', cellInd, value: 'ship' },
    });
  };

  const submit = () => {
    send({ type: 'SetPositions', payload: { roomId, positions } });
  };

  const start = () => {
    send({ type: 'StartGame', payload: { roomId: room.id } });
  };

  return (
    <StyledRoomPage maxWidth={800}>
      <Link to="rooms">to rooms</Link>
      <ButtonsRow>
        <ExtendedButton onClick={random} disabled={isPlayerReady}>
          random
        </ExtendedButton>
        <ExtendedButton onClick={reset} disabled={isPlayerReady}>
          reset
        </ExtendedButton>
      </ButtonsRow>
      <Positions
        positions={positions.map((row) =>
          row.map((cell) =>
            cell === 'ship'
              ? isPlayerReady
                ? theme.disabledColor
                : theme.primaryColor
              : theme.backgroundColor,
          ),
        )}
        onCheck={isPlayerReady ? undefined : onCheck}
      />
      <ButtonsRow>
        {isRoomOwner && isPlayerReady ? (
          <ExtendedButton onClick={start} disabled={!isOpponentReady}>
            start
          </ExtendedButton>
        ) : (
          <ExtendedButton onClick={submit} disabled={isPlayerReady}>
            submit
          </ExtendedButton>
        )}
      </ButtonsRow>
    </StyledRoomPage>
  );
};

export default RoomPage;
