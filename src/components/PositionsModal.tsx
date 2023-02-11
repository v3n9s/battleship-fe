import { FC, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useStore } from '../hooks/store';
import { useWs } from '../hooks/ws';
import Modal from './Modal';
import Positions from './Positions';
import Button from './styled/Button';

const ButtonsRow = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
`;

const PositionsModal: FC = () => {
  const { dispatch, state } = useStore();

  const { send } = useWs();

  const theme = useTheme();

  const positions = state.positionsModal.roomId
    ? state.positions[state.positionsModal.roomId]
    : undefined;

  useEffect(() => {
    if (state.positionsModal.roomId && !positions) {
      dispatch({
        type: 'ResetPositions',
        payload: { roomId: state.positionsModal.roomId },
      });
    }
  }, [dispatch, positions, state.positionsModal.roomId]);

  const closeModal = () => {
    dispatch({ type: 'ClosePositionsModal' });
  };

  const random = () => {
    if (state.positionsModal.roomId) {
      dispatch({
        type: 'SetRandomPositions',
        payload: {
          roomId: state.positionsModal.roomId,
        },
      });
    }
  };

  const reset = () => {
    if (state.positionsModal.roomId) {
      dispatch({
        type: 'ResetPositions',
        payload: { roomId: state.positionsModal.roomId },
      });
    }
  };

  const onCheck = ([rowInd, colInd]: [number, number]) => {
    if (state.positionsModal.roomId && positions) {
      dispatch({
        type: 'SetPositions',
        payload: {
          roomId: state.positionsModal.roomId,
          field: positions.map((row, prevRowInd) =>
            prevRowInd === rowInd
              ? row.map((v, cellInd) => (cellInd === colInd ? !v : v))
              : row,
          ),
        },
      });
    }
  };

  const submit = () => {
    const { roomId } = state.positionsModal;
    if (roomId) {
      const positions = state.positions[roomId];
      if (positions) {
        send({ type: 'SetPositions', payload: { roomId, positions } });
      }
    }
  };

  return positions ? (
    <Modal onClose={closeModal} maxWidth={800} isOpen={true}>
      <>
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
        </ButtonsRow>
      </>
    </Modal>
  ) : null;
};

export default PositionsModal;
