import { UserData } from 'battleship-be/types';
import { createContext } from 'react';

export const UserDataContext = createContext(
  null as unknown as { userData: UserData },
);
