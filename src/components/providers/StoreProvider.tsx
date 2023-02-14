import { FC, ReactElement, useCallback, useReducer } from 'react';
import {
  RootReducerContext,
  RootReducerContextDispatch,
} from '../../contexts/root-reducer';
import { rootReducer } from '../../reducers/root';

const StoreProvider: FC<{ children?: ReactElement }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, {
    rooms: [],
    serverResponded: false,
    passwordModal: {
      roomId: null,
    },
    positions: {},
    positionsModal: {
      roomId: null,
    },
    alerts: [],
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

export default StoreProvider;
