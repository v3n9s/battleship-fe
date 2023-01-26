import { FC } from 'react';
import styled from 'styled-components';
import { Field } from '../types';

const StyledPositions = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
`;

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
`;

const StyledCell = styled.div<{ checked: boolean }>`
  width: 10%;
  height: 100%;
  background-color: ${(props) =>
    props.checked ? props.theme.primaryColor : props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  transition: background-color 0.15s linear;
`;

const Positions: FC<{
  positions: Field;
  onCheck?: ((ind: [number, number]) => void) | undefined;
}> = ({ positions, onCheck }) => {
  return (
    <StyledPositions>
      {positions.map((row, rowInd) => (
        <StyledRow key={rowInd}>
          {row.map((cell, cellInd) => (
            <StyledCell
              key={cellInd}
              onClick={onCheck && (() => onCheck([rowInd, cellInd]))}
              checked={cell}
            />
          ))}
        </StyledRow>
      ))}
    </StyledPositions>
  );
};

export default Positions;
