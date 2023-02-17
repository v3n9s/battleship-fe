import { FC, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Positions from './Positions';
import Button from './styled/Button';
import Container from './styled/Container';

const StyledRoomPage = styled(Container)`
  padding: 10px 10px 0px;
`;

const ButtonsRow = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
`;

const RoomPage: FC<{ roomId: string }> = ({ roomId }) => {
  const { dispatch, state } = useStore();

  const { send } = useWs();

  const theme = useTheme();

  const room = state.rooms.find((room) => room.id === roomId);

  const positions = state.positions[roomId];

  useEffect(() => {
    if (room && !positions) {
      dispatch({
        type: 'ResetPositions',
        payload: { roomId },
      });
    }
  }, [room, dispatch, positions, roomId]);

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
    if (positions) {
      dispatch({
        type: 'SetCell',
        payload: { roomId, cellInd },
      });
    }
  };

  const submit = () => {
    if (positions) {
      send({ type: 'SetPositions', payload: { roomId, positions } });
    }
  };

  const ready = () => {
    send({ type: 'ReadyToPlay', payload: { roomId } });
  };

  const toRooms = () => {
    dispatch({ type: 'SetRoomPageId', payload: { roomId: null } });
  };

  return room && positions ? (
    <StyledRoomPage maxWidth={800}>
      <Positions
        positions={positions.map((row) =>
          row.map((cell) =>
            cell ? theme.primaryColor : theme.backgroundColor,
          ),
        )}
        onCheck={onCheck}
      />
      <ButtonsRow>
        <Button onClick={random}>random</Button>
        <Button onClick={reset}>reset</Button>
        <Button onClick={submit}>submit</Button>
        <Button onClick={ready}>ready</Button>
      </ButtonsRow>
      <ButtonsRow>
        <Button onClick={toRooms}>to rooms</Button>
      </ButtonsRow>
    </StyledRoomPage>
  ) : null;
};

export default RoomPage;
