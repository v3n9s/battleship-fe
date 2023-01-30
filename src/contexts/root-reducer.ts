import { createContext, Dispatch } from 'react';
import { RootReducerActionType, RootReducerType } from '../reducers/root';

type ThunkAction = (dispatch: Dispatch<RootReducerActionType>) => void;

export type RootReducerContextDispatch = Dispatch<
  RootReducerActionType | ThunkAction
>;

type RootReducerContextType = {
  state: RootReducerType;
  dispatch: RootReducerContextDispatch;
};

export const RootReducerContext = createContext(
  null as unknown as RootReducerContextType,
);
