import { produce } from 'immer';
import { getEmptyField, getRandomField } from '../services/field';
import {
  AttacksCell,
  MatrixOf,
  ObjectToUnion,
  PositionsCell,
  Room as RoomDto,
  ServerMessage,
} from '../types';

export type Alert = {
  id: string;
  text: string;
  isShowed: boolean;
};

export type Room = RoomDto & {
  positions?: MatrixOf<PositionsCell> | undefined;
  attacks?: MatrixOf<AttacksCell> | undefined;
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
    cellInd: [number, number];
  } & (
    | { field: 'positions'; value: PositionsCell }
    | { field: 'attacks'; value: AttacksCell }
  );
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

export const rootReducer = produce(
  (state: RootReducerType, action: RootReducerActionType) => {
    if (action.type === 'ExistingRooms') {
      state.rooms = action.payload;
      state.serverResponded = true;
    } else if (action.type === 'ExistingPositions') {
      state.rooms.forEach((r) => {
        if (r.id in action.payload) {
          r.positions = action.payload[r.id];
        }
      });
    } else if (action.type === 'RoomCreate') {
      state.rooms.push(action.payload);
    } else if (action.type === 'RoomJoin') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.player2 = {
          ...action.payload.user,
          hasPositions: false,
        };
      }
    } else if (action.type === 'RoomLeave') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.player2 = undefined;
      }
    } else if (action.type === 'RoomDelete') {
      state.rooms = state.rooms.filter((r) => r.id !== action.payload.roomId);
    } else if (action.type === 'RoomPositionsSet') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room?.player1.id === action.payload.userId) {
        room.player1.hasPositions = true;
      } else if (room?.player2?.id === action.payload.userId) {
        room.player2.hasPositions = true;
      }
    } else if (action.type === 'OpenPasswordModal') {
      state.passwordModal = { roomId: action.payload.roomId };
    } else if (action.type === 'ClosePasswordModal') {
      state.passwordModal = { roomId: null };
    } else if (action.type === 'ResetPositions') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.positions = getEmptyField();
      }
    } else if (action.type === 'SetCell') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        const row = room[action.payload.field]?.[action.payload.cellInd[0]];
        if (row) {
          row[action.payload.cellInd[1]] = action.payload.value;
        }
      }
    } else if (action.type === 'SetRandomPositions') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.positions = getRandomField();
      }
    } else if (action.type === 'ShowAlert') {
      state.alerts.push({
        id: action.payload.id ?? crypto.randomUUID(),
        text: action.payload.text,
        isShowed: true,
      });
    } else if (action.type === 'HideAlert') {
      const alert = state.alerts.find((a) => a.id === action.payload.id);
      if (alert) {
        alert.isShowed = false;
      }
    } else if (action.type === 'RemoveAlert') {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload.id,
      );
    } else if (action.type === 'GameStart') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room) {
        room.game = action.payload.game;
      }
    } else if (action.type === 'GameHit') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room && room.game) {
        const positions =
          room.game.player1.id === action.payload.userId
            ? room.game.player1.attacks
            : room.game.player2.id === action.payload.userId
            ? room.game.player2.attacks
            : undefined;
        if (positions) {
          const row = positions[action.payload.position[0]];
          if (row) {
            row[action.payload.position[1]] = 'hit';
          }
        }
      }
    } else if (action.type === 'GameMiss') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room && room.game) {
        const positions =
          room.game.player1.id === action.payload.userId
            ? room.game.player1.attacks
            : room.game.player2.id === action.payload.userId
            ? room.game.player2.attacks
            : undefined;
        if (positions) {
          const row = positions[action.payload.position[0]];
          if (row) {
            row[action.payload.position[1]] = 'miss';
            room.game.movingPlayerId =
              action.payload.userId === room.game.player1.id
                ? room.game.player2.id
                : room.game.player1.id;
          }
        }
      }
    } else if (action.type === 'GameDestroy') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room && room.game) {
        const positions =
          room.game.player1.id === action.payload.userId
            ? room.game.player1.attacks
            : room.game.player2.id === action.payload.userId
            ? room.game.player2.attacks
            : undefined;
        if (positions) {
          action.payload.cellsAroundShip.forEach((cellIndex) => {
            const row = positions[cellIndex[0]];
            if (row) {
              row[cellIndex[1]] = 'miss';
            }
          });
        }
      }
    } else if (action.type === 'GameEnd') {
      const room = state.rooms.find((r) => r.id === action.payload.roomId);
      if (room && room.game) {
        room.game.winner = action.payload.winner;
      }
    }
  },
);
