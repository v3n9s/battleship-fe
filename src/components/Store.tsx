import { UserData } from '../types';
import { FC, ReactElement, useReducer } from 'react';
import { RootReducerContext } from '../contexts/root-reducer';
import { rootReducer } from '../reducers/root';

const Store: FC<{ children?: ReactElement; userData: UserData }> = ({
  children,
  userData,
}) => {
  const [state, dispatch] = useReducer(rootReducer, {
    userData,
    rooms: [],
    serverResponded: false,
  });

  return (
    <RootReducerContext.Provider value={{ state, dispatch }}>
      {children}
    </RootReducerContext.Provider>
  );
};

export default Store;
