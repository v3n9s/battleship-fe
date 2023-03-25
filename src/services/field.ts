import { MatrixOf, PositionsCell } from '../types';

export const getEmptyField = () => {
  return new Array<'empty'[]>(10)
    .fill(new Array<'empty'>(10).fill('empty'))
    .map((v) => [...v]);
};

const getCellsAroundCell = ([colInd, rowInd]: [number, number]): [
  number,
  number,
][] => {
  return [
    [colInd - 1, rowInd - 1],
    [colInd - 1, rowInd],
    [colInd - 1, rowInd + 1],
    [colInd, rowInd - 1],
    [colInd, rowInd + 1],
    [colInd + 1, rowInd - 1],
    [colInd + 1, rowInd],
    [colInd + 1, rowInd + 1],
  ];
};

const getCellsAroundCells = (cells: [number, number][]): [number, number][] => {
  return cells
    .map((cell) => getCellsAroundCell(cell))
    .flat()
    .reduce((acc, [rowInd, colInd]) => {
      if (
        !acc.some(
          ([uniqueRowInd, uniqueColInd]) =>
            uniqueRowInd === rowInd && uniqueColInd === colInd,
        ) &&
        !cells.some(
          ([shipRowInd, shipColInd]) =>
            shipRowInd === rowInd && shipColInd === colInd,
        )
      ) {
        acc.push([rowInd, colInd]);
      }
      return acc;
    }, [] as [number, number][]);
};

const isFree = (field: MatrixOf<PositionsCell>, cells: [number, number][]) => {
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
    .fill([rowInd, colInd])
    .map(
      ([rowInd, colInd]: [number, number], i) =>
        (isHorizontal ? [rowInd + i, colInd] : [rowInd, colInd + i]) as [
          number,
          number,
        ],
    );
};

const setRandomShips = (
  field: MatrixOf<PositionsCell>,
  size: number,
  amount: number,
) => {
  if (amount === 0) {
    return;
  }

  let shipCells;
  do {
    shipCells = getRandomShip(size);
  } while (!isFree(field, shipCells));

  shipCells.forEach(([rowInd, y]) => {
    const row = field[rowInd];
    if (row) {
      row[y] = 'ship';
    }
  });
  setRandomShips(field, size, amount - 1);
};

export const getRandomField = () => {
  const field = getEmptyField();
  setRandomShips(field, 4, 1);
  setRandomShips(field, 3, 2);
  setRandomShips(field, 2, 3);
  setRandomShips(field, 1, 4);
  return field;
};
