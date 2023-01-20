import { createContext, Dispatch } from 'react';
import { RootReducerActionType, RootReducerType } from '../reducers/root';

type RootReducerContextType = {
  state: RootReducerType;
  dispatch: Dispatch<RootReducerActionType>;
};

export const RootReducerContext = createContext(
  null as unknown as RootReducerContextType,
);
