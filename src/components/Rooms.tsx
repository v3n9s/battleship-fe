import { FC, useCallback, useContext, useReducer, useRef } from 'react';
import {
  ClientMessage,
  CreateRoomMessage,
  RoomDto,
  ServerMessage,
} from '../types';
import { useWs } from '../hooks/ws';
import { getWsConnection } from '../services/ws-connection';
import Form from './Form';
import RoomsItem from './RoomsItem';
import { UserDataContext } from '../contexts/user-data';

type ReducerType = {
  rooms: RoomDto[];
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

const Rooms: FC = () => {
  const [state, dispatch] = useReducer(roomReducer, {
    rooms: [],
    serverResponded: false,
  });

  const { token } = useContext(UserDataContext);

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
        : state.rooms.map((room) => (
            <RoomsItem key={room.id} room={room} ws={ws.current} />
          ))}
    </>
  );
};

export default Rooms;
