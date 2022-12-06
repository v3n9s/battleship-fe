import { FC, useReducer } from 'react';
import { Room, ServerMessage } from '../types';
import { useWs } from '../hooks/ws';
import { getWsConnection } from '../services/ws-connection';

type ReducerType = {
  rooms: Room[];
  serverResponded: boolean;
};

const roomReducer = (
  state: ReducerType,
  action: ServerMessage,
): ReducerType => {
  if (action.type === 'ExistingRooms') {
    return {
      rooms: action.payload,
      serverResponded: true,
    };
  }
  return state;
};

const Rooms: FC<{ token: string }> = ({ token }) => {
  const [state, dispatch] = useReducer(roomReducer, {
    rooms: [],
    serverResponded: false,
  });

  const [isConnecting] = useWs<ServerMessage>(getWsConnection(token), dispatch);

  return (
    <>
      {isConnecting || !state.serverResponded
        ? 'Loading...'
        : state.rooms.length === 0
        ? 'There is no rooms yet'
        : state.rooms.map((room) => <div key={room.id}>{room.name}</div>)}
    </>
  );
};

export default Rooms;
