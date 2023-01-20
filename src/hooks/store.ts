import { useContext } from 'react';
import { RootReducerContext } from '../contexts/root-reducer';

export const useStore = () => {
  return useContext(RootReducerContext);
};
