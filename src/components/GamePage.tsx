import { FC, useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import Positions from './common/Positions';
import Container from './styled/Container';
import { CellIndex, Game, Room } from '../types';
import { useWs } from '../hooks/ws';
import ButtonsRow from './styled/ButtontsRow';
import Button from './styled/Button';
import { UserDataContext } from '../contexts/user-data';
import Link from './common/Link';

const StyledGamePage = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const Title = styled.div`
  font-size: 30px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  flex: 1 0 50px;
`;

const GamePage: FC<{ room: Room & { game: Game } }> = ({ room }) => {
  const { userData } = useContext(UserDataContext);

  const { send } = useWs();

  const theme = useTheme();

  const [selectedPlayerId, setSelectedPlayerId] = useState(
    room.game.movingPlayerId,
  );

  const [isAutoSwitch, _setIsAutoSwitch] = useState(true);

  const setIsAutoSwitch: typeof _setIsAutoSwitch = (value) => {
    if (value) {
      setSelectedPlayerId(room.game.movingPlayerId);
    }
    _setIsAutoSwitch(value);
  };

  useEffect(() => {
    if (isAutoSwitch) {
      const timerId = window.setTimeout(() => {
        setSelectedPlayerId(room.game.movingPlayerId);
      }, 750);
      return () => {
        window.clearTimeout(timerId);
      };
    }
  }, [isAutoSwitch, room.game.movingPlayerId]);

  const selectedPlayer =
    selectedPlayerId === room.game.player1.id
      ? room.game.player1
      : room.game.player2;

  const movingPlayer =
    room.game.movingPlayerId === room.game.player1.id
      ? room.game.player1
      : room.game.player2;

  const canMove = room.game.movingPlayerId === userData.id && !room.game.winner;

  const onCheck = (cellInd: CellIndex) => {
    if (canMove) {
      send({
        type: 'MoveGame',
        payload: { roomId: room.id, position: cellInd },
      });
    }
  };

  return (
    <StyledGamePage maxWidth={800}>
      {room.game.winner ? (
        <>
          <Title>Game ended, player {room.game.winner.name} won</Title>
          <Link to="/rooms">to rooms</Link>
        </>
      ) : (
        <>
          <Title>{`${movingPlayer.name}'s turn`}</Title>
          <StyledButton onClick={() => setIsAutoSwitch((prev) => !prev)}>
            Toggle auto-switch ({isAutoSwitch ? 'on' : 'off'})
          </StyledButton>
        </>
      )}
      <ButtonsRow>
        {[room.game.player1, room.game.player2].map((player) => (
          <StyledButton
            key={player.id}
            disabled={selectedPlayerId === player.id}
            onClick={() => {
              setSelectedPlayerId(player.id);
              setIsAutoSwitch(false);
            }}
          >
            {player.name} field
          </StyledButton>
        ))}
      </ButtonsRow>
      <Positions
        positions={selectedPlayer.attacks.map((row) =>
          row.map((cell) =>
            cell === 'empty'
              ? theme.backgroundColor
              : cell === 'hit'
              ? theme.primaryColor
              : theme.disabledColor,
          ),
        )}
        disabled={!canMove}
        onCheck={onCheck}
      />
    </StyledGamePage>
  );
};

export default GamePage;
