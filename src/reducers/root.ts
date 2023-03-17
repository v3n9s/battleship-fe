import { getEmptyField, getRandomField } from '../services/field';
import { Field, ObjectToUnion, Room as RoomDto, ServerMessage } from '../types';

export type Alert = {
  id: string;
  text: string;
  isShowed: boolean;
};

export type Room = RoomDto & {
  positions?: Field | undefined;
  attacks?: Field | undefined;
};

export type RootReducerType = {
  rooms: Room[];
  serverResponded: boolean;
  passwordModal: {
    roomId: string | null;
  };
  alerts: Alert[];
};

type Actions = {
  OpenPasswordModal: {
    roomId: string;
  };
  ClosePasswordModal: undefined;
  ResetPositions: {
    roomId: string;
  };
  SetCell: {
    roomId: string;
    field: 'positions' | 'attacks';
    cellInd: [number, number];
  };
  SetRandomPositions: {
    roomId: string;
  };
  ShowAlert: {
    id?: string;
    text: string;
  };
  HideAlert: {
    id: string;
  };
  RemoveAlert: {
    id: string;
  };
};

export type RootReducerActionType =
  | ObjectToUnion<{
      [K in keyof Actions]: Actions[K] extends undefined
        ? { type: K }
        : { type: K; payload: Actions[K] };
    }>
  | ServerMessage;

export const rootReducer = (
  state: RootReducerType,
  action: RootReducerActionType,
): RootReducerType => {
  if (action.type === 'ExistingRooms') {
    return { ...state, rooms: action.payload, serverResponded: true };
  } else if (action.type === 'ExistingPositions') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id in action.payload ? { ...r, positions: action.payload[r.id] } : r,
      ),
    };
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
                hasPositions: false,
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
  } else if (action.type === 'RoomPositionsSet') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? r.player1.id === action.payload.userId
            ? { ...r, player1: { ...r.player1, hasPositions: true } }
            : r.player2?.id === action.payload.userId
            ? { ...r, player2: { ...r.player2, hasPositions: true } }
            : r
          : r,
      ),
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
  } else if (action.type === 'ResetPositions') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? { ...r, positions: getEmptyField() }
          : r,
      ),
    };
  } else if (action.type === 'SetCell') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? {
              ...r,
              [action.payload.field]: (
                r[action.payload.field] || getEmptyField()
              ).map((row, rowInd) =>
                rowInd === action.payload.cellInd[0]
                  ? row.map((v, cellInd) =>
                      cellInd === action.payload.cellInd[1] ? !v : v,
                    )
                  : row,
              ),
            }
          : r,
      ),
    };
  } else if (action.type === 'SetRandomPositions') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? { ...r, positions: getRandomField() }
          : r,
      ),
    };
  } else if (action.type === 'ShowAlert') {
    return {
      ...state,
      alerts: [
        ...state.alerts,
        {
          id: action.payload.id ?? crypto.randomUUID(),
          text: action.payload.text,
          isShowed: true,
        },
      ],
    };
  } else if (action.type === 'HideAlert') {
    return {
      ...state,
      alerts: state.alerts.map((alert) =>
        alert.id === action.payload.id ? { ...alert, isShowed: false } : alert,
      ),
    };
  } else if (action.type === 'RemoveAlert') {
    return {
      ...state,
      alerts: state.alerts.filter((alert) => alert.id !== action.payload.id),
    };
  }
  return state;
};
