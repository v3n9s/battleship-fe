import { ServerMessage } from '../types';
import { createContext } from 'react';
import { RoomsReducerType } from '../reducers/rooms';

type RoomsContextType = {
  state: RoomsReducerType;
  dispatch: (action: ServerMessage) => void;
};

export const RoomsContext = createContext(null as unknown as RoomsContextType);
