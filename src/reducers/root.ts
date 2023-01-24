import { Field, Room, ServerMessage, UserData } from '../types';

const getEmptyField = () => {
  return new Array(10)
    .fill(new Array(10).fill(false))
    .map((v) => [...(v as boolean[])]);
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

export type RootReducerActionType =
  | OpenPasswordModalAction
  | ClosePasswordModalAction
  | OpenPositionsModalAction
  | ClosePositionsModalAction
  | ResetPositionsAction
  | SetPositionsAction
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
  }
  return state;
};
