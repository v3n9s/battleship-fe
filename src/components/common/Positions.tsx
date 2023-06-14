import { FC } from 'react';
import styled from 'styled-components';

const StyledPositions = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0px auto;
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};

  &:hover {
    cursor: ${(props) => (props.$disabled ? '' : 'pointer')};
  }
`;

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
`;

const StyledCell = styled.div<{ $color: string }>`
  width: 10%;
  height: 100%;
  background-color: ${(props) => props.$color};
  border: 1px solid ${(props) => props.theme.primaryColor};
  transition: background-color 0.15s linear;
`;

const Positions: FC<{
  positions: string[][];
  disabled?: boolean | undefined;
  onCheck?: ((ind: [number, number]) => void) | undefined;
}> = ({ positions, disabled = false, onCheck }) => {
  return (
    <StyledPositions $disabled={disabled}>
      {positions.map((row, rowInd) => (
        <StyledRow key={rowInd}>
          {row.map((color, cellInd) => (
            <StyledCell
              key={cellInd}
              onClick={onCheck && (() => onCheck([rowInd, cellInd]))}
              $color={color}
            />
          ))}
        </StyledRow>
      ))}
    </StyledPositions>
  );
};

export default Positions;
