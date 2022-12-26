import { RoomDto, ServerMessage } from 'battleship-types';

export type RoomsReducerType = {
  rooms: RoomDto[];
  serverResponded: boolean;
};

export const roomsReducer = (
  state: RoomsReducerType,
  action: ServerMessage,
): RoomsReducerType => {
  if (action.type === 'ExistingRooms') {
    return {
      rooms: action.payload,
      serverResponded: true,
    };
  } else if (action.type === 'RoomCreated') {
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
