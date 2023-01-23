import { Room, ServerMessage, UserData } from '../types';

export type RootReducerType = {
  userData: UserData;
  rooms: Room[];
  serverResponded: boolean;
};

export type RootReducerActionType = ServerMessage;

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
          ? { ...r, player2: action.payload.user }
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
  }
  return state;
};