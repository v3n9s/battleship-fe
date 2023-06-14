import { getCellsAroundCells, getFieldOf } from 'battleship-be/src/ships-field';
import { CellIndex, MatrixOf, PositionsCell } from '../types';

export * from 'battleship-be/src/ships-field';

const isFree = (field: MatrixOf<PositionsCell>, cells: CellIndex[]) => {
  return [...cells, ...getCellsAroundCells(cells)].every(
    ([rowInd, colInd]) =>
      !field[rowInd]?.[colInd] || field[rowInd]?.[colInd] === 'empty',
  );
};

const getRandomShip = (size: number) => {
  const isHorizontal = Math.random() > 0.5;
  let rowInd = Math.floor(Math.random() * 10);
  let colInd = Math.floor(Math.random() * (10 - size + 1));
  if (isHorizontal) {
    [rowInd, colInd] = [colInd, rowInd];
  }
  return new Array(size)
    .fill(undefined)
    .map(
      (_, i) =>
        (isHorizontal
          ? [rowInd + i, colInd]
          : [rowInd, colInd + i]) as CellIndex,
    );
};

const setRandomShips = (
  field: MatrixOf<PositionsCell>,
  size: number,
  amount: number,
) => {
  if (amount <= 0) {
    return;
  }

  let shipCells;
  do {
    shipCells = getRandomShip(size);
  } while (!isFree(field, shipCells));

  shipCells.forEach(([rowInd, colInd]) => {
    const row = field[rowInd];
    if (row) {
      row[colInd] = 'ship';
    }
  });
  setRandomShips(field, size, amount - 1);
};

export const getRandomField = () => {
  const field = getFieldOf('empty');
  setRandomShips(field, 4, 1);
  setRandomShips(field, 3, 2);
  setRandomShips(field, 2, 3);
  setRandomShips(field, 1, 4);
  return field;
};
