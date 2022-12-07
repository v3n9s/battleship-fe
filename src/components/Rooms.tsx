import { FC, useCallback, useReducer, useRef } from 'react';
import {
  ClientMessage,
  CreateRoomMessage,
  Room,
  ServerMessage,
} from '../types';
import { useWs } from '../hooks/ws';
import { getWsConnection } from '../services/ws-connection';
import Form from './Form';

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
  } else if (action.type === 'RoomCreated') {
    return {
      ...state,
      rooms: [...state.rooms, action.payload],
    };
  }
  return state;
};

const Rooms: FC<{ token: string }> = ({ token }) => {
  const [state, dispatch] = useReducer(roomReducer, {
    rooms: [],
    serverResponded: false,
  });

  const ws = useRef(getWsConnection(token));

  const [isConnecting] = useWs<ServerMessage>(ws.current, dispatch);

  const createRoom = useCallback((payload: CreateRoomMessage) => {
    ws.current.send(
      JSON.stringify({ type: 'CreateRoom', payload } satisfies ClientMessage),
    );
  }, []);

  return (
    <>
      <Form
        fields={{
          name: {
            type: 'text',
            placeholder: 'Name',
            value: '',
          },
          password: {
            type: 'password',
            placeholder: 'Password',
            value: '',
          },
        }}
        onSubmit={createRoom}
        submitButtonText="Create room"
      />
      {isConnecting || !state.serverResponded
        ? 'Loading...'
        : state.rooms.length === 0
        ? 'There is no rooms yet'
        : state.rooms.map((room) => <div key={room.id}>{room.name}</div>)}
    </>
  );
};

export default Rooms;
