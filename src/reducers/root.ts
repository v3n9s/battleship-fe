import { Field, Room, ServerMessage, UserData } from '../types';

const getEmptyField = () => {
  return new Array(10)
    .fill(new Array(10).fill(false))
    .map((v) => [...(v as boolean[])]);
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

const isFree = (field: Field, cells: [number, number][]) => {
  return [...cells, ...getCellsAroundCells(cells)].every(
    ([rowInd, colInd]) => !field[rowInd]?.[colInd],
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

const setRandomShips = (field: Field, size: number, amount: number) => {
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
      row[y] = true;
    }
  });
  setRandomShips(field, size, amount - 1);
};

const getRandomField = () => {
  const field = getEmptyField();
  setRandomShips(field, 4, 1);
  setRandomShips(field, 3, 2);
  setRandomShips(field, 2, 3);
  setRandomShips(field, 1, 4);
  return field;
};

export type RootReducerType = {
  userData: UserData;
  rooms: Room[];
  serverResponded: boolean;
  passwordModal: {
    roomId: string | null;
  };
  positionsModal: {
    roomId: string | null;
  };
  positions: {
    [roomId: string]: Field;
  };
};

type OpenPasswordModalAction = {
  type: 'OpenPasswordModal';
  payload: {
    roomId: string;
  };
};

type ClosePasswordModalAction = {
  type: 'ClosePasswordModal';
};

type OpenPositionsModalAction = {
  type: 'OpenPositionsModal';
  payload: {
    roomId: string;
  };
};

type ClosePositionsModalAction = {
  type: 'ClosePositionsModal';
};

type ResetPositionsAction = {
  type: 'ResetPositions';
  payload: {
    roomId: string;
  };
};

type SetPositionsAction = {
  type: 'SetPositions';
  payload: {
    roomId: string;
    field: Field;
  };
};

type SetRandomPositionsAction = {
  type: 'SetRandomPositions';
  payload: {
    roomId: string;
  };
};

export type RootReducerActionType =
  | OpenPasswordModalAction
  | ClosePasswordModalAction
  | OpenPositionsModalAction
  | ClosePositionsModalAction
  | ResetPositionsAction
  | SetPositionsAction
  | SetRandomPositionsAction
  | ServerMessage;

export const rootReducer = (
  state: RootReducerType,
  action: RootReducerActionType,
): RootReducerType => {
  if (action.type === 'ExistingRooms') {
    return { ...state, rooms: action.payload, serverResponded: true };
  } else if (action.type === 'RoomCreate') {
    return {
      ...state,
      rooms: [...state.rooms, action.payload],
    };
  } else if (action.type === 'RoomJoin') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? {
              ...r,
              player2: {
                ...action.payload.user,
                readyToPlay: false,
              },
            }
          : r,
      ),
    };
  } else if (action.type === 'RoomLeave') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId ? { ...r, player2: undefined } : r,
      ),
    };
  } else if (action.type === 'RoomDelete') {
    return {
      ...state,
      rooms: state.rooms.filter((r) => r.id !== action.payload.roomId),
    };
  } else if (action.type === 'OpenPasswordModal') {
    return {
      ...state,
      passwordModal: { roomId: action.payload.roomId },
    };
  } else if (action.type === 'ClosePasswordModal') {
    return {
      ...state,
      passwordModal: { roomId: null },
    };
  } else if (action.type === 'OpenPositionsModal') {
    return {
      ...state,
      positionsModal: { roomId: action.payload.roomId },
    };
  } else if (action.type === 'ClosePositionsModal') {
    return {
      ...state,
      positionsModal: { roomId: null },
    };
  } else if (action.type === 'ResetPositions') {
    return {
      ...state,
      positions: {
        ...state.positions,
        [action.payload.roomId]: getEmptyField(),
      },
    };
  } else if (action.type === 'SetPositions') {
    return {
      ...state,
      positions: {
        ...state.positions,
        [action.payload.roomId]: action.payload.field,
      },
    };
  } else if (action.type === 'SetRandomPositions') {
    return {
      ...state,
      positions: {
        ...state.positions,
        [action.payload.roomId]: getRandomField(),
      },
    };
  }
  return state;
};
