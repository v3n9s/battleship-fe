import { getEmptyField, getRandomField } from '../services/field';
import { Field, ObjectToUnion, Room, ServerMessage } from '../types';

export type Alert = {
  id: string;
  text: string;
  isShowed: boolean;
};

export type RootReducerType = {
  rooms: Room[];
  serverResponded: boolean;
  passwordModal: {
    roomId: string | null;
  };
  positions: {
    [roomId: string]: Field;
  };
  alerts: Alert[];
  roomPageId: string | null;
};

type Actions = {
  OpenPasswordModal: {
    roomId: string;
  };
  ClosePasswordModal: undefined;
  ResetPositions: {
    roomId: string;
  };
  SetPositions: {
    roomId: string;
    field: Field;
  };
  SetCell: {
    roomId: string;
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
  SetRoomPageId: {
    roomId: string | null;
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
    return { ...state, positions: action.payload };
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
      positions: Object.fromEntries(
        Object.entries(state.positions).filter(
          ([roomId]) => roomId !== action.payload.roomId,
        ),
      ),
    };
  } else if (action.type === 'RoomReadyToPlay') {
    return {
      ...state,
      rooms: state.rooms.map((r) =>
        r.id === action.payload.roomId
          ? r.player1.id === action.payload.userId
            ? { ...r, player1: { ...r.player1, readyToPlay: true } }
            : r.player2?.id === action.payload.userId
            ? { ...r, player2: { ...r.player2, readyToPlay: true } }
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
  } else if (action.type === 'SetCell') {
    return {
      ...state,
      positions: {
        ...state.positions,
        [action.payload.roomId]: (
          state.positions[action.payload.roomId] || getEmptyField()
        ).map((row, prevRowInd) =>
          prevRowInd === action.payload.cellInd[0]
            ? row.map((v, cellInd) =>
                cellInd === action.payload.cellInd[1] ? !v : v,
              )
            : row,
        ),
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
  } else if (action.type === 'SetRoomPageId') {
    return { ...state, roomPageId: action.payload.roomId };
  }
  return state;
};
