import { UserData } from '../types';
import { FC, ReactElement, useCallback, useReducer } from 'react';
import {
  RootReducerContext,
  RootReducerContextDispatch,
} from '../contexts/root-reducer';
import { rootReducer } from '../reducers/root';

const Store: FC<{ children?: ReactElement; userData: UserData }> = ({
  children,
  userData,
}) => {
  const [state, dispatch] = useReducer(rootReducer, {
    userData,
    rooms: [],
    serverResponded: false,
    passwordModal: {
      roomId: null,
    },
    positions: {},
    positionsModal: {
      roomId: null,
    },
  });

  const thunkDispatch = useCallback<RootReducerContextDispatch>(
    (action) => {
      if (typeof action === 'function') {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch],
  );

  return (
    <RootReducerContext.Provider value={{ state, dispatch: thunkDispatch }}>
      {children}
    </RootReducerContext.Provider>
  );
};

export default Store;
